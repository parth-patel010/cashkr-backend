import PricingQuizRecord from '../models/PricingQuizRecord.js';
import {
  requestDeviceValuation,
  serializePricingRecord,
} from '../utils/pricingQuizService.js';
import {
  getAgentQueueStats,
  getQueuePosition,
  processRecordById,
  startPricingAgentWorker,
} from '../services/cashify/batchWorker.js';
import { withDbRetry } from '../utils/dbRetry.js';

const DB_RETRY = { attempts: 8, delayMs: 1000 };

function kickValuationAgent(recordId) {
  startPricingAgentWorker();
  processRecordById(recordId).catch((err) => {
    console.error(`[valuation] Agent run failed for ${recordId}:`, err.message);
  });
}

function isTerminalStatus(status) {
  return ['completed', 'partial', 'skipped', 'overridden', 'failed'].includes(status);
}

function isSuccessStatus(status) {
  return ['completed', 'partial', 'skipped', 'overridden'].includes(status);
}

function displayStatus(status) {
  return status === 'skipped' ? 'overridden' : status;
}

function buildSubmitValuationResponse(result, record, queue) {
  const base = {
    ...result,
    agentStatus: displayStatus(result.agentStatus),
    queuePosition: 0,
    agentBusy: queue.agentBusy,
    pendingCount: queue.pending,
  };

  if (!record) return base;

  const done = isTerminalStatus(record.agentStatus);
  const success = isSuccessStatus(record.agentStatus) && record.ourOffer != null;

  return {
    ...base,
    recordId: String(record._id),
    agentStatus: displayStatus(record.agentStatus),
    cached: result.cached
      || (['skipped', 'overridden'].includes(record.agentStatus) && Boolean(record.ourOffer)),
    done,
    success,
    ourOffer: record.ourOffer,
    cashifyPrice: record.cashifyPrice,
    internalPrice: record.internalPrice,
    error: record.error || null,
    note: record.note || null,
    quizHash: record.quizHash,
    queuePosition: ['pending', 'running'].includes(record.agentStatus)
      ? 1
      : 0,
  };
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
    }), DB_RETRY);

    if (result.error) {
      return res.status(400).json({ message: result.message || 'Unable to start valuation' });
    }

    const queue = await withDbRetry(() => getAgentQueueStats(), DB_RETRY);

    // Save record now; run Cashify in background. Frontend keeps popup open and polls status.
    if (!result.cached && result.recordId) {
      kickValuationAgent(result.recordId);
      const queuePosition = await withDbRetry(
        () => getQueuePosition(result.recordId),
        DB_RETRY,
      );
      return res.json({
        ...buildSubmitValuationResponse(result, null, queue),
        recordId: result.recordId,
        agentStatus: 'running',
        done: false,
        success: false,
        queuePosition,
      });
    }

    return res.json({
      ...buildSubmitValuationResponse(result, null, queue),
      done: Boolean(result.cached && result.ourOffer != null),
      success: Boolean(result.cached && result.ourOffer != null),
      queuePosition: 0,
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
    const record = await withDbRetry(
      () => PricingQuizRecord.findById(recordId).lean(),
      DB_RETRY,
    );
    if (!record) {
      return res.status(404).json({ message: 'Valuation not found' });
    }

    if (record.sourceType === 'user_valuation' && record.sourceId && req.user?.id) {
      if (String(record.sourceId) !== String(req.user.id)) {
        return res.status(403).json({ message: 'Not allowed to view this valuation' });
      }
    }

    const queue = await withDbRetry(() => getAgentQueueStats(), DB_RETRY);
    const queuePosition = ['pending', 'running'].includes(record.agentStatus)
      ? await withDbRetry(() => getQueuePosition(recordId), DB_RETRY)
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
