import PricingQuizRecord from '../../models/PricingQuizRecord.js';
import Device from '../../models/Device.js';
import AgentTestRun from '../../models/AgentTestRun.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js';
import { buildCashifyProductUrlCandidates } from '../../config/cashify.js';
import { findCompletedByHash, serializePricingRecord } from '../../utils/pricingQuizService.js';
import { upsertPricingQuizRecord } from '../../utils/pricingQuizService.js';
import { hasFilledQuizFromSource, hasMeaningfulQuizSummary, pricingAgentEligibleFilter } from '../../utils/quizFilled.js';
import { buildQuizSummaryFromPayload } from '../../utils/buildQuizSummary.js';
import { computeOurOfferFromSettings } from '../../utils/offerMarkup.js';

const POLL_MS = 5000;
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
    const record = await PricingQuizRecord.findOneAndUpdate(
      { agentStatus: 'pending', ...pricingAgentEligibleFilter() },
      { $set: { agentStatus: 'running', runAt: new Date() } },
      { sort: { createdAt: 1 }, new: true },
    );
    if (record) {
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
  if (!record || record.agentStatus !== 'pending') return 0;
  const ahead = await PricingQuizRecord.countDocuments({
    agentStatus: 'pending',
    ...pricingAgentEligibleFilter(),
    $or: [
      { createdAt: { $lt: record.createdAt } },
      { createdAt: record.createdAt, _id: { $lt: record._id } },
    ],
  });
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
      await PricingQuizRecord.findByIdAndUpdate(record._id, { agentStatus: 'pending' });
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
