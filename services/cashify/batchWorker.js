import PricingQuizRecord from '../models/PricingQuizRecord.js';
import Device from '../models/Device.js';
import AgentTestRun from '../models/AgentTestRun.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import config, { buildCashifyProductUrlCandidates } from '../config/cashify.js';
import { findCompletedByHash, serializePricingRecord } from '../utils/pricingQuizService.js';
import { orderDeviceToQuizPayload } from '../utils/orderDeviceToQuizPayload.js';
import { upsertPricingQuizRecord } from '../utils/pricingQuizService.js';

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
      agentStatus: 'skipped',
      cashifyPrice: cached.cashifyPrice,
      ourOffer: cached.ourOffer,
      difference: cached.difference,
      cashifyProductUrl: cached.cashifyProductUrl || '',
      note: 'Duplicate quiz — using existing completed result.',
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
    const ourOffer = cashifyPrice ? cashifyPrice + config.MARKUP_INR : null;
    const internalPrice = record.internalPrice;
    const difference = ourOffer != null && internalPrice != null ? internalPrice - ourOffer : null;
    const agentStatus = flowResult.loginRequired || flowResult.note ? 'partial' : 'completed';

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
        markupInr: config.MARKUP_INR,
      },
      status: agentStatus,
      runBy: 'pricing-agent-worker',
      durationMs: Date.now() - started,
    });
  } catch (error) {
    const msg = cleanPlaywrightError(error.message);
    await PricingQuizRecord.findByIdAndUpdate(record._id, {
      agentStatus: error.cashifyPrice ? 'partial' : 'failed',
      cashifyPrice: error.cashifyPrice || null,
      ourOffer: error.cashifyPrice ? error.cashifyPrice + config.MARKUP_INR : null,
      difference: error.cashifyPrice && record.internalPrice
        ? record.internalPrice - (error.cashifyPrice + config.MARKUP_INR)
        : null,
      error: msg,
      completedAt: new Date(),
      durationMs: Date.now() - started,
    });
  }
}

async function workerTick() {
  if (workerRunning) return;
  workerRunning = true;
  try {
    const record = await PricingQuizRecord.findOneAndUpdate(
      { agentStatus: 'pending' },
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
  });

  for (const record of all) {
    const cached = await findCompletedByHash(record.slug, record.quizHash);
    if (cached && String(cached._id) !== String(record._id)) {
      await PricingQuizRecord.findByIdAndUpdate(record._id, {
        agentStatus: 'skipped',
        cashifyPrice: cached.cashifyPrice,
        ourOffer: cached.ourOffer,
        difference: cached.difference,
        cashifyProductUrl: cached.cashifyProductUrl || '',
        note: 'Already completed for this device + quiz.',
        completedAt: new Date(),
      });
      skipped += 1;
    } else {
      await PricingQuizRecord.findByIdAndUpdate(record._id, { agentStatus: 'pending' });
      pending += 1;
    }
  }

  const alreadyPending = await PricingQuizRecord.countDocuments({ agentStatus: 'pending' });
  const alreadyCompleted = await PricingQuizRecord.countDocuments({
    agentStatus: { $in: ['completed', 'partial'] },
  });

  return {
    pending: alreadyPending,
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
    const record = await upsertPricingQuizRecord({
      slug: d.slug,
      category: d.category,
      brand: d.brand,
      modelName: d.modelName,
      storage: d.storage,
      quizPayload: { ...quizPayload, slug: d.slug },
      quizSummary: d.answerSummary || [],
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
    const quizPayload = orderDeviceToQuizPayload(order.device);
    if (!quizPayload) continue;
    const record = await upsertPricingQuizRecord({
      slug: order.device.slug,
      category: order.device.category,
      brand: order.device.brand,
      modelName: order.device.modelName,
      storage: order.device.storage,
      quizPayload,
      quizSummary: order.device.answerSummary || [],
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
