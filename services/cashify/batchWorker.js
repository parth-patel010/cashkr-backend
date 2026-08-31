import PricingQuizRecord from '../../models/PricingQuizRecord.js';
import Device from '../../models/Device.js';
import AgentTestRun from '../../models/AgentTestRun.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js';
import { buildCashifyProductUrlCandidates } from '../../config/cashify.js';
import { findCompletedByHash, serializePricingRecord, upsertPricingQuizRecord, computeInternalPrice } from '../../utils/pricingQuizService.js';
import { hasFilledQuizFromSource, hasMeaningfulQuizSummary, pricingAgentEligibleFilter } from '../../utils/quizFilled.js';
import { buildQuizSummaryFromPayload } from '../../utils/buildQuizSummary.js';
import { computeOurOfferFromSettings } from '../../utils/offerMarkup.js';

const POLL_MS = 5000;
/** Re-queue jobs stuck in `running` (crashed worker / hung Playwright). */
const STALE_RUNNING_MS = 3 * 60 * 1000;
/** Highest catalog basePrice first; FIFO within the same base. */
const QUEUE_SORT = { basePrice: -1, createdAt: 1, _id: 1 };

let workerTimer = null;
let workerRunning = false;

function cleanPlaywrightError(message) {
  return String(message || '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');
}

function isAgentBusyError(message) {
  const msg = String(message || '').toLowerCase();
  return (
    msg.includes('another cashify quote is already running')
    || msg.includes('quote is already running')
    || msg.includes('try again in a moment')
    || msg.includes('agent is busy')
    || msg.includes('valuation agent is busy')
    || msg.includes('timed out')
    || msg.includes('re-queued')
  );
}

async function requeueBusyRecord(recordId, message) {
  const current = await PricingQuizRecord.findById(recordId).select('requeueCount').lean();
  const count = (current?.requeueCount || 0) + 1;
  // Soft cap so a permanently stuck lock does not retry forever.
  if (count > 60) {
    await PricingQuizRecord.findByIdAndUpdate(recordId, {
      agentStatus: 'failed',
      error: 'Valuation agent stayed busy too long. Please try again.',
      completedAt: new Date(),
      note: 'Exceeded busy re-queue limit.',
    });
    return;
  }
  await PricingQuizRecord.findByIdAndUpdate(recordId, {
    $set: {
      agentStatus: 'pending',
      error: null,
      note: 'Waiting in queue — valuation agent was busy with another job.',
      runAt: null,
      completedAt: null,
    },
    $inc: { requeueCount: 1 },
  });
  console.log(`[pricing-agent] Re-queued ${recordId} (busy #${count}): ${cleanPlaywrightError(message)}`);
}

async function recoverStaleRunningRecords() {
  const cutoff = new Date(Date.now() - STALE_RUNNING_MS);
  const result = await PricingQuizRecord.updateMany(
    {
      agentStatus: 'running',
      $or: [
        { runAt: { $lt: cutoff } },
        { runAt: null, updatedAt: { $lt: cutoff } },
      ],
    },
    {
      $set: {
        agentStatus: 'pending',
        error: null,
        note: 'Re-queued after stale running state — waiting for agent again.',
        runAt: null,
      },
      $inc: { requeueCount: 1 },
    },
  );
  if (result.modifiedCount > 0) {
    console.log(`[pricing-agent] Recovered ${result.modifiedCount} stale running job(s)`);
  }
}

function pendingAheadFilter(record) {
  const basePrice = Number(record.basePrice) || 0;
  const createdAt = record.createdAt || new Date(0);
  const samePriority = basePrice === 0
    ? [{ basePrice: 0 }, { basePrice: null }, { basePrice: { $exists: false } }]
    : [{ basePrice }];

  return {
    agentStatus: 'pending',
    ...pricingAgentEligibleFilter(),
    $or: [
      { basePrice: { $gt: basePrice } },
      {
        $and: [
          { $or: samePriority },
          {
            $or: [
              { createdAt: { $lt: createdAt } },
              { createdAt, _id: { $lt: record._id } },
            ],
          },
        ],
      },
    ],
  };
}

async function getCashifyServices() {
  const [session, laptop, mobile] = await Promise.all([
    import('./sessionManager.js'),
    import('./laptopFlow.js'),
    import('./mobileFlow.js'),
  ]);
  return {
    runLaptopFlow: laptop.runLaptopFlow,
    runMobileFlow: mobile.runMobileFlow,
  };
}

async function processOneRecord(record) {
  const started = Date.now();
  let finished = false;

  const finalizeRunning = async (patch) => {
    finished = true;
    await PricingQuizRecord.findByIdAndUpdate(record._id, patch);
  };

  try {
    const device = await Device.findOne({ slug: record.slug, isActive: true });
    if (!device) {
      await finalizeRunning({
        agentStatus: 'failed',
        error: 'Device not found in catalog.',
        completedAt: new Date(),
        durationMs: Date.now() - started,
      });
      return;
    }

    const cached = await findCompletedByHash(record.slug, record.quizHash);
    if (cached && String(cached._id) !== String(record._id)) {
      await finalizeRunning({
        agentStatus: 'overridden',
        cashifyPrice: cached.cashifyPrice,
        ourOffer: cached.ourOffer,
        difference: cached.difference,
        cashifyProductUrl: cached.cashifyProductUrl || '',
        overriddenFromRecordId: String(cached._id),
        note: 'Quiz overridden — same quiz always returns this locked price.',
        completedAt: new Date(),
        durationMs: Date.now() - started,
      });
      return;
    }

    const category = record.category;
    const productUrls = buildCashifyProductUrlCandidates(device, { storage: record.storage });
    if (!productUrls.length) {
      await finalizeRunning({
        agentStatus: 'failed',
        error: 'No Cashify URL for this device.',
        completedAt: new Date(),
        durationMs: Date.now() - started,
      });
      return;
    }

    const { runLaptopFlow, runMobileFlow } = await getCashifyServices();
    const runFlow = category === 'mobile' ? runMobileFlow : runLaptopFlow;
    const flowResult = await runFlow(record.quizPayload, {
      productUrls,
      modelName: device.modelName,
      device,
    });

    const cashifyPrice = flowResult.cashifyPrice;
    const ourOffer = cashifyPrice
      ? await computeOurOfferFromSettings(cashifyPrice, category, record.basePrice)
      : null;
    const internalPrice = record.internalPrice;
    const difference = ourOffer != null && internalPrice != null ? internalPrice - ourOffer : null;
    const agentStatus = flowResult.loginRequired || flowResult.note ? 'partial' : 'completed';
    const markupInr = ourOffer != null && cashifyPrice != null ? ourOffer - cashifyPrice : null;

    await finalizeRunning({
      agentStatus,
      cashifyPrice,
      ourOffer,
      difference,
      cashifyProductUrl: flowResult.productUrl || productUrls[0],
      note: flowResult.note || null,
      error: null,
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });

    await AgentTestRun.create({
      category,
      brand: device.brand,
      modelName: device.modelName,
      slug: device.slug,
      storage: record.storage || '',
      quizPayload: record.quizPayload,
      internalResult: { finalPrice: internalPrice },
      cashifyResult: {
        cashifyPrice,
        ourOffer,
        productUrl: flowResult.productUrl,
        note: flowResult.note,
      },
      comparison: {
        internalPrice,
        cashifyPrice,
        ourOffer,
        difference,
        markupInr,
      },
      status: agentStatus,
      runBy: 'pricing-agent-worker',
      durationMs: Date.now() - started,
    });
  } catch (error) {
    const msg = cleanPlaywrightError(error.message);

    if (isAgentBusyError(msg) && !error.cashifyPrice) {
      await requeueBusyRecord(record._id, msg);
      finished = true;
      return;
    }

    const productUrlsTried = error.productUrlsTried
      || error.debugArtifacts?.productUrlsTried
      || [];
    const failOffer = error.cashifyPrice
      ? await computeOurOfferFromSettings(error.cashifyPrice, record.category, record.basePrice)
      : null;

    await finalizeRunning({
      agentStatus: error.cashifyPrice ? 'partial' : 'failed',
      cashifyPrice: error.cashifyPrice || null,
      ourOffer: failOffer,
      difference: failOffer != null && record.internalPrice != null
        ? record.internalPrice - failOffer
        : null,
      error: msg,
      note: /could not open a valid cashify product page/i.test(msg) && productUrlsTried.length
        ? `Tried ${productUrlsTried.length} Cashify URL(s). Set cashifyProductUrl on this device if all failed.`
        : null,
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });

    await AgentTestRun.create({
      category: record.category,
      brand: record.brand,
      modelName: record.modelName,
      slug: record.slug,
      storage: record.storage || '',
      quizPayload: record.quizPayload,
      internalResult: { finalPrice: record.internalPrice },
      cashifyResult: {
        cashifyPrice: error.cashifyPrice || null,
        ourOffer: failOffer,
        productUrl: productUrlsTried[0]?.url || '',
        note: msg,
        productUrlsTried,
      },
      comparison: {
        internalPrice: record.internalPrice,
        cashifyPrice: error.cashifyPrice || null,
        ourOffer: failOffer,
        difference: failOffer != null && record.internalPrice != null
          ? record.internalPrice - failOffer
          : null,
        markupInr: failOffer != null && error.cashifyPrice != null
          ? failOffer - error.cashifyPrice
          : null,
      },
      status: error.cashifyPrice ? 'partial' : 'failed',
      runBy: 'pricing-agent-worker',
      durationMs: Date.now() - started,
    }).catch(() => {});
  }
}

async function workerTick() {
  if (workerRunning) return;
  workerRunning = true;
  try {
    await recoverStaleRunningRecords();
    const record = await PricingQuizRecord.findOneAndUpdate(
      { agentStatus: 'pending', ...pricingAgentEligibleFilter() },
      { $set: { agentStatus: 'running', runAt: new Date(), error: null, note: null, completedAt: null } },
      { sort: QUEUE_SORT, new: true },
    );
    if (record) {
      // Backfill basePrice for older pending rows so priority sorting stays accurate.
      if (!(Number(record.basePrice) > 0)) {
        const device = await Device.findOne({ slug: record.slug, isActive: true }).lean();
        if (device) {
          const internal = computeInternalPrice(device, record.quizPayload || {}, record.category);
          const basePrice = Number(internal?.basePrice) || 0;
          if (basePrice > 0) {
            await PricingQuizRecord.findByIdAndUpdate(record._id, { basePrice });
            record.basePrice = basePrice;
          }
        }
      }
      await processOneRecord(record);
    }
  } catch (error) {
    console.error('Pricing agent worker error:', error.message);
  } finally {
    workerRunning = false;
  }
}

export function startPricingAgentWorker() {
  if (workerTimer) return;
  workerTimer = setInterval(workerTick, POLL_MS);
  workerTick();
  console.log('Pricing agent batch worker started');
}

export function stopPricingAgentWorker() {
  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }
}

export function isWorkerRunning() {
  return workerRunning;
}

export async function getAgentQueueStats() {
  const filter = pricingAgentEligibleFilter();
  const [pending, running] = await Promise.all([
    PricingQuizRecord.countDocuments({ agentStatus: 'pending', ...filter }),
    PricingQuizRecord.countDocuments({ agentStatus: 'running', ...filter }),
  ]);
  return {
    workerRunning,
    pending,
    running,
    agentBusy: workerRunning || running > 0,
  };
}

export async function getQueuePosition(recordId) {
  const record = await PricingQuizRecord.findById(recordId).lean();
  if (!record) return 0;
  if (record.agentStatus === 'running') return 1;
  if (record.agentStatus !== 'pending') return 0;
  const ahead = await PricingQuizRecord.countDocuments(pendingAheadFilter(record));
  return ahead + 1;
}

export async function enqueueOneRecord(recordId) {
  const record = await PricingQuizRecord.findById(recordId);
  if (!record) {
    return { error: 'NOT_FOUND', message: 'Record not found.' };
  }

  const eligible = await PricingQuizRecord.findOne({
    _id: recordId,
    ...pricingAgentEligibleFilter(),
  }).lean();
  if (!eligible) {
    return { error: 'INELIGIBLE', message: 'This row has no filled quiz — sync or complete a quiz first.' };
  }

  const cached = await findCompletedByHash(record.slug, record.quizHash);
  if (cached && String(cached._id) !== String(record._id)) {
    await PricingQuizRecord.findByIdAndUpdate(record._id, {
      agentStatus: 'overridden',
      cashifyPrice: cached.cashifyPrice,
      ourOffer: cached.ourOffer,
      difference: cached.difference,
      cashifyProductUrl: cached.cashifyProductUrl || '',
      overriddenFromRecordId: String(cached._id),
      note: 'Quiz overridden — same quiz always returns this locked price.',
      completedAt: cached.completedAt || new Date(),
      error: null,
    });
    return {
      status: 'overridden',
      message: 'Same quiz already completed — locked to existing override price.',
      recordId: String(record._id),
      queuePosition: 0,
    };
  }

  const patch = {
    agentStatus: 'pending',
    error: null,
    note: null,
    completedAt: null,
    runAt: null,
    durationMs: 0,
  };

  if (!(Number(record.basePrice) > 0)) {
    const device = await Device.findOne({ slug: record.slug, isActive: true }).lean();
    if (device) {
      const internal = computeInternalPrice(
        device,
        record.quizPayload || {},
        record.category,
      );
      if (internal?.basePrice != null) patch.basePrice = Number(internal.basePrice) || 0;
      if (record.internalPrice == null && internal?.finalPrice != null) {
        patch.internalPrice = internal.finalPrice;
      }
    }
  }

  await PricingQuizRecord.findByIdAndUpdate(record._id, patch);
  const queuePosition = await getQueuePosition(record._id);

  return {
    status: 'pending',
    message: 'Queued for Cashify valuation.',
    recordId: String(record._id),
    queuePosition,
  };
}

export async function enqueueAllPending() {
  const records = await PricingQuizRecord.find({
    agentStatus: { $in: ['failed', 'running'] },
  });

  let skipped = 0;
  let pending = 0;

  for (const record of records) {
    if (record.agentStatus === 'running') {
      await PricingQuizRecord.findByIdAndUpdate(record._id, {
        agentStatus: 'pending',
        note: null,
        error: null,
        runAt: null,
        completedAt: null,
      });
    }
  }

  const all = await PricingQuizRecord.find({
    agentStatus: { $nin: ['completed', 'partial', 'skipped'] },
    ...pricingAgentEligibleFilter(),
  });

  for (const record of all) {
    const cached = await findCompletedByHash(record.slug, record.quizHash);
    if (cached && String(cached._id) !== String(record._id)) {
      await PricingQuizRecord.findByIdAndUpdate(record._id, {
        agentStatus: 'overridden',
        cashifyPrice: cached.cashifyPrice,
        ourOffer: cached.ourOffer,
        difference: cached.difference,
        cashifyProductUrl: cached.cashifyProductUrl || '',
        overriddenFromRecordId: String(cached._id),
        note: 'Quiz overridden — same quiz always returns this locked price.',
        completedAt: new Date(),
      });
      skipped += 1;
    } else {
      const patch = {
        agentStatus: 'pending',
        error: null,
        note: null,
        completedAt: null,
        runAt: null,
      };
      if (!(Number(record.basePrice) > 0)) {
        const device = await Device.findOne({ slug: record.slug, isActive: true }).lean();
        if (device) {
          const internal = computeInternalPrice(
            device,
            record.quizPayload || {},
            record.category,
          );
          if (internal?.basePrice != null) patch.basePrice = Number(internal.basePrice) || 0;
          if (record.internalPrice == null && internal?.finalPrice != null) {
            patch.internalPrice = internal.finalPrice;
          }
        }
      }
      await PricingQuizRecord.findByIdAndUpdate(record._id, patch);
      pending += 1;
    }
  }

  const alreadyPending = await PricingQuizRecord.countDocuments({
    agentStatus: 'pending',
    ...pricingAgentEligibleFilter(),
  });
  const alreadyCompleted = await PricingQuizRecord.countDocuments({
    agentStatus: { $in: ['completed', 'partial'] },
    ...pricingAgentEligibleFilter(),
  });

  return {
    pending: alreadyPending,
    overridden: skipped,
    skipped,
    enqueued: pending,
    alreadyCompleted,
  };
}

export async function syncPricingRecordsFromSources() {
  let imported = 0;

  const users = await User.find({
    'lastQuizDevice.slug': { $exists: true, $ne: '' },
    'lastQuizDevice.category': { $in: ['mobile', 'laptop', 'mac'] },
  }).select('lastQuizDevice _id updatedAt').lean();

  for (const user of users) {
    const d = user.lastQuizDevice;
    const quizPayload = d.quizPayload || d.answers || buildQuizFromLastDevice(d);
    if (!quizPayload?.slug && !d.slug) continue;
    let summary = d.answerSummary || [];
    if (!hasMeaningfulQuizSummary(summary)) {
      summary = buildQuizSummaryFromPayload({ ...quizPayload, slug: d.slug }, d.category);
    }
    if (!hasMeaningfulQuizSummary(summary)) continue;
    if (!hasFilledQuizFromSource(quizPayload, summary, d.category)) continue;
    const record = await upsertPricingQuizRecord({
      slug: d.slug,
      category: d.category,
      brand: d.brand,
      modelName: d.modelName,
      storage: d.storage,
      quizPayload: { ...quizPayload, slug: d.slug },
      quizSummary: summary,
      sourceType: 'backfill',
      sourceId: String(user._id),
      capturedAt: d.loggedInAt || user.updatedAt,
    });
    if (record) imported += 1;
  }

  const orders = await Order.find({
    'device.slug': { $exists: true, $ne: '' },
    'device.category': { $in: ['mobile', 'laptop', 'mac'] },
  }).select('device orderId createdAt').lean();

  for (const order of orders) {
    const quizPayload = order.device;
    if (!quizPayload?.slug) continue;
    let summary = order.device.answerSummary || [];
    if (!hasMeaningfulQuizSummary(summary)) {
      summary = buildQuizSummaryFromPayload(quizPayload, order.device.category);
    }
    if (!hasMeaningfulQuizSummary(summary)) continue;
    if (!hasFilledQuizFromSource(quizPayload, summary, order.device.category)) continue;
    const record = await upsertPricingQuizRecord({
      slug: order.device.slug,
      category: order.device.category,
      brand: order.device.brand,
      modelName: order.device.modelName,
      storage: order.device.storage,
      quizPayload,
      quizSummary: summary,
      sourceType: 'order',
      sourceId: order.orderId,
      capturedAt: order.createdAt,
    });
    if (record) imported += 1;
  }

  return { imported };
}

function buildQuizFromLastDevice(d) {
  return {
    slug: d.slug,
    storage: d.storage,
    ...((d.answers && typeof d.answers === 'object') ? d.answers : {}),
  };
}
