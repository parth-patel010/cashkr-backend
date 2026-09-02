import PricingQuizRecord from '../models/PricingQuizRecord.js';
import {
  requestDeviceValuation,
  serializePricingRecord,
} from '../utils/pricingQuizService.js';
import { getAgentQueueStats, getQueuePosition } from '../services/cashify/batchWorker.js';
import { withDbRetry } from '../utils/dbRetry.js';

function isTerminalStatus(status) {
  return ['completed', 'partial', 'skipped', 'overridden', 'failed'].includes(status);
}

function isSuccessStatus(status) {
  return ['completed', 'partial', 'skipped', 'overridden'].includes(status);
}

function displayStatus(status) {
  return status === 'skipped' ? 'overridden' : status;
}

async function submitCategoryValuation(req, res, next, category) {
  try {
    const {
      slug,
      quizPayload,
      quizSummary,
      brand,
      modelName,
      storage,
    } = req.body;

    if (!slug || !quizPayload) {
      return res.status(400).json({ message: 'slug and quizPayload are required' });
    }

    const result = await withDbRetry(() => requestDeviceValuation({
      slug,
      category,
      quizPayload: { ...quizPayload, slug },
      quizSummary: Array.isArray(quizSummary) ? quizSummary : [],
      userId: req.user?.id,
      brand,
      modelName,
      storage,
    }));

    if (result.error) {
      return res.status(400).json({ message: result.message || 'Unable to start valuation' });
    }

    const queue = await withDbRetry(() => getAgentQueueStats());
    let queuePosition = 0;
    if (!result.cached && result.recordId) {
      queuePosition = await withDbRetry(() => getQueuePosition(result.recordId));
    }

    return res.json({
      ...result,
      agentStatus: displayStatus(result.agentStatus),
      queuePosition,
      agentBusy: queue.agentBusy,
      pendingCount: queue.pending,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitLaptopValuation(req, res, next) {
  return submitCategoryValuation(req, res, next, 'laptop');
}

export async function submitMobileValuation(req, res, next) {
  return submitCategoryValuation(req, res, next, 'mobile');
}

export async function getLaptopValuationStatus(req, res, next) {
  return getValuationStatus(req, res, next);
}

export async function getMobileValuationStatus(req, res, next) {
  return getValuationStatus(req, res, next);
}

async function getValuationStatus(req, res, next) {
  try {
    const { recordId } = req.params;
    const record = await withDbRetry(() => PricingQuizRecord.findById(recordId).lean());
    if (!record) {
      return res.status(404).json({ message: 'Valuation not found' });
    }

    if (record.sourceType === 'user_valuation' && record.sourceId && req.user?.id) {
      if (String(record.sourceId) !== String(req.user.id)) {
        return res.status(403).json({ message: 'Not allowed to view this valuation' });
      }
    }

    const queue = await withDbRetry(() => getAgentQueueStats());
    const queuePosition = ['pending', 'running'].includes(record.agentStatus)
      ? await withDbRetry(() => getQueuePosition(recordId))
      : 0;

    const done = isTerminalStatus(record.agentStatus);
    const success = isSuccessStatus(record.agentStatus) && record.ourOffer != null;

    return res.json({
      recordId: String(record._id),
      agentStatus: displayStatus(record.agentStatus),
      cached: ['skipped', 'overridden'].includes(record.agentStatus) && Boolean(record.ourOffer),
      done,
      success,
      ourOffer: record.ourOffer,
      cashifyPrice: record.cashifyPrice,
      internalPrice: record.internalPrice,
      error: record.error || null,
      note: record.note || null,
      queuePosition,
      agentBusy: queue.agentBusy,
      pendingCount: queue.pending,
      runningCount: queue.running,
      record: done ? serializePricingRecord(record) : undefined,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLaptopValuationAgentStatus(req, res) {
  const queue = await getAgentQueueStats();
  res.json(queue);
}

export async function getMobileValuationAgentStatus(req, res) {
  const queue = await getAgentQueueStats();
  res.json(queue);
}
