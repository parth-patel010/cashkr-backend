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
/** Re-queue jobs stuck in `running` (crashed worker / lock contention). */
const STALE_RUNNING_MS = 12 * 60 * 1000;
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
  const device = await Device.findOne({ slug: record.slug, isActive: true });
  if (!device) {
    await PricingQuizRecord.findByIdAndUpdate(record._id, {
      agentStatus: 'failed',
      error: 'Device not found in catalog.',
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });
    return;
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
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });
    return;
  }

  const category = record.category;
  const productUrls = buildCashifyProductUrlCandidates(device);
  if (!productUrls.length) {
    await PricingQuizRecord.findByIdAndUpdate(record._id, {
      agentStatus: 'failed',
      error: 'No Cashify URL for this device.',
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });
    return;
  }

  try {
    const { runLaptopFlow, runMobileFlow } = await getCashifyServices();
    const runFlow = category === 'mobile' ? runMobileFlow : runLaptopFlow;
    const flowResult = await runFlow(record.quizPayload, {
      productUrls,
      modelName: device.modelName,
    });

    const cashifyPrice = flowResult.cashifyPrice;
    const ourOffer = cashifyPrice
      ? await computeOurOfferFromSettings(cashifyPrice, category)
      : null;
    const internalPrice = record.internalPrice;
    const difference = ourOffer != null && internalPrice != null ? internalPrice - ourOffer : null;
    const agentStatus = flowResult.loginRequired || flowResult.note ? 'partial' : 'completed';
    const markupInr = ourOffer != null && cashifyPrice != null ? ourOffer - cashifyPrice : null;

    await PricingQuizRecord.findByIdAndUpdate(record._id, {
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

    // Never surface "agent busy" as a user-facing failure — put job back in the priority queue.
    if (isAgentBusyError(msg) && !error.cashifyPrice) {
      await requeueBusyRecord(record._id, msg);
      return;
    }

    const productUrlsTried = error.productUrlsTried
      || error.debugArtifacts?.productUrlsTried
      || productUrls.map((url) => ({ url }));
    const failOffer = error.cashifyPrice
      ? await computeOurOfferFromSettings(error.cashifyPrice, category)
      : null;
    await PricingQuizRecord.findByIdAndUpdate(record._id, {
      agentStatus: error.cashifyPrice ? 'partial' : 'failed',
      cashifyPrice: error.cashifyPrice || null,
      ourOffer: failOffer,
      difference: failOffer != null && record.internalPrice != null
        ? record.internalPrice - failOffer
        : null,
      error: msg,
      note: productUrlsTried.length
        ? `Tried ${productUrlsTried.length} Cashify URL(s). Set cashifyProductUrl on this device if all failed.`
        : null,
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
      internalResult: { finalPrice: record.internalPrice },
      cashifyResult: {
        cashifyPrice: error.cashifyPrice || null,
        ourOffer: failOffer,
        productUrl: productUrls[0] || '',
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
      { $set: { agentStatus: 'running', runAt: new Date(), error: null } },
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

export async function enqueueAllPending() {
  const records = await PricingQuizRecord.find({
    agentStatus: { $in: ['failed', 'running'] },
  });

  let skipped = 0;
  let pending = 0;

  for (const record of records) {
    if (record.agentStatus === 'running') {
      await PricingQuizRecord.findByIdAndUpdate(record._id, { agentStatus: 'pending' });
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
      const patch = { agentStatus: 'pending', error: null };
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
  }).select('lastQuizDevice _id').lean();

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
    });
    if (record) imported += 1;
  }

  const orders = await Order.find({
    'device.slug': { $exists: true, $ne: '' },
    'device.category': { $in: ['mobile', 'laptop', 'mac'] },
  }).select('device orderId').lean();

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
