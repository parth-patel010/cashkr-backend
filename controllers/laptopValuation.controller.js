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
import { withDbRetry, isMongoRetryableError } from '../utils/dbRetry.js';
import { getValuationRun, mergeValuationRun, setValuationRun } from '../utils/valuationRunCache.js';
import { valuationLog } from '../utils/valuationLog.js';

const DB_RETRY = { attempts: 12, delayMs: 1000 };

function kickValuationAgent(recordId) {
  setValuationRun(recordId, { agentStatus: 'running' });
  startPricingAgentWorker();
  valuationLog('info', 'agent kicked', { recordId });
  processRecordById(recordId).catch((err) => {
    valuationLog('error', 'agent run failed', { recordId, err: err.message });
    setValuationRun(recordId, {
      agentStatus: 'failed',
      error: err.message || 'Valuation agent failed.',
      completedAt: new Date(),
    });
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

function buildStatusResponse(record, queue = {}) {
  const agentStatus = displayStatus(record.agentStatus);
  const done = isTerminalStatus(record.agentStatus);
  const success = isSuccessStatus(record.agentStatus) && record.ourOffer != null;

  return {
    recordId: String(record._id || record.recordId),
    agentStatus,
    cached: ['skipped', 'overridden'].includes(record.agentStatus) && Boolean(record.ourOffer),
    done,
    success,
    ourOffer: record.ourOffer ?? null,
    cashifyPrice: record.cashifyPrice ?? null,
    internalPrice: record.internalPrice ?? null,
    error: record.error || null,
    note: record.note || null,
    quizHash: record.quizHash,
    queuePosition: queue.queuePosition ?? 0,
    agentBusy: queue.agentBusy ?? false,
    pendingCount: queue.pending ?? 0,
    runningCount: queue.running ?? 0,
    record: done ? serializePricingRecord(record) : undefined,
  };
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

  const status = buildStatusResponse(record, queue);
  return {
    ...base,
    ...status,
    cached: result.cached || status.cached,
  };
}

async function loadQueueStatsSafe() {
  try {
    return await withDbRetry(() => getAgentQueueStats(), DB_RETRY);
  } catch (err) {
    valuationLog('warn', 'queue stats DB failed — using fallback', { err: err.message });
    return { agentBusy: true, pending: 0, running: 1 };
  }
}

async function loadQueuePositionSafe(recordId, record) {
  if (!['pending', 'running'].includes(record?.agentStatus)) return 0;
  try {
    return await withDbRetry(() => getQueuePosition(recordId), DB_RETRY);
  } catch {
    return 1;
  }
}

async function submitCategoryValuation(req, res, next, category) {
  const started = Date.now();
  try {
    const {
      slug,
      quizPayload,
      quizSummary,
      brand,
      modelName,
      storage,
    } = req.body;

    valuationLog('info', 'quote submit', {
      category,
      slug,
      storage: storage || quizPayload?.storage || '',
      userId: req.user?.id,
      brand: brand || '',
      model: modelName || '',
    });

    if (!slug || !quizPayload) {
      valuationLog('warn', 'quote rejected — missing slug/quizPayload', { category });
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
      valuationLog('warn', 'quote rejected by requestDeviceValuation', {
        category,
        slug,
        error: result.error,
        message: result.message,
      });
      return res.status(400).json({ message: result.message || 'Unable to start valuation' });
    }

    const queue = await loadQueueStatsSafe();

    if (!result.cached && result.recordId) {
      kickValuationAgent(result.recordId);
      const queuePosition = await loadQueuePositionSafe(result.recordId, { agentStatus: 'running' });
      valuationLog('info', 'quote queued for agent', {
        category,
        slug,
        recordId: result.recordId,
        quizHash: result.quizHash,
        queuePosition,
        ms: Date.now() - started,
      });
      return res.json({
        ...buildSubmitValuationResponse(result, null, queue),
        recordId: result.recordId,
        agentStatus: 'running',
        done: false,
        success: false,
        queuePosition,
      });
    }

    valuationLog('info', 'quote returned cached', {
      category,
      slug,
      recordId: result.recordId,
      agentStatus: result.agentStatus,
      ourOffer: result.ourOffer,
      ms: Date.now() - started,
    });

    return res.json({
      ...buildSubmitValuationResponse(result, null, queue),
      done: Boolean(result.cached && result.ourOffer != null),
      success: Boolean(result.cached && result.ourOffer != null),
      queuePosition: 0,
    });
  } catch (error) {
    if (isMongoRetryableError(error)) {
      valuationLog('error', 'quote submit DB unavailable', {
        category,
        err: error.message,
        ms: Date.now() - started,
      });
      return res.status(503).json({
        message: 'Database temporarily unavailable. Please try again in a moment.',
      });
    }
    valuationLog('error', 'quote submit failed', {
      category,
      err: error.message,
      ms: Date.now() - started,
    });
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
    const mem = getValuationRun(recordId);

    let record = null;
    try {
      record = await withDbRetry(
        () => PricingQuizRecord.findById(recordId).lean(),
        DB_RETRY,
      );
    } catch (dbErr) {
      valuationLog('warn', 'status poll DB blip — using memory/fallback', {
        recordId,
        memStatus: mem?.agentStatus || '(none)',
        err: dbErr.message,
      });
      if (mem?.agentStatus) {
        const queue = await loadQueueStatsSafe();
        return res.json(buildStatusResponse(
          { _id: recordId, ...mem },
          { ...queue, queuePosition: 1 },
        ));
      }
      return res.json({
        recordId: String(recordId),
        agentStatus: 'running',
        done: false,
        success: false,
        ourOffer: null,
        cashifyPrice: null,
        internalPrice: null,
        error: null,
        note: 'Reconnecting to valuation service…',
        queuePosition: 1,
        agentBusy: true,
        pendingCount: 0,
        runningCount: 1,
      });
    }

    if (!record) {
      if (mem?.agentStatus) {
        valuationLog('warn', 'status poll — DB miss, memory hit', {
          recordId,
          memStatus: mem.agentStatus,
        });
        const queue = await loadQueueStatsSafe();
        return res.json(buildStatusResponse({ _id: recordId, ...mem }, queue));
      }
      valuationLog('warn', 'status poll 404', { recordId });
      return res.status(404).json({ message: 'Valuation not found' });
    }

    if (record.sourceType === 'user_valuation' && record.sourceId && req.user?.id) {
      if (String(record.sourceId) !== String(req.user.id)) {
        valuationLog('warn', 'status poll 403 owner mismatch', {
          recordId,
          userId: req.user.id,
          sourceId: record.sourceId,
        });
        return res.status(403).json({ message: 'Not allowed to view this valuation' });
      }
    }

    record = mergeValuationRun(recordId, record);
    const queue = await loadQueueStatsSafe();
    const queuePosition = await loadQueuePositionSafe(recordId, record);
    const payload = buildStatusResponse(record, { ...queue, queuePosition });

    // Only log terminal / failed polls — avoid flooding PM2 every 2.5s
    if (payload.done || payload.agentStatus === 'failed') {
      valuationLog('info', 'status poll terminal', {
        recordId,
        agentStatus: payload.agentStatus,
        success: payload.success,
        ourOffer: payload.ourOffer,
        error: payload.error,
      });
    }

    return res.json(payload);
  } catch (error) {
    valuationLog('error', 'status poll crashed', {
      recordId: req.params?.recordId,
      err: error.message,
    });
    next(error);
  }
}

export async function getLaptopValuationAgentStatus(req, res) {
  const queue = await loadQueueStatsSafe();
  res.json(queue);
}

export async function getMobileValuationAgentStatus(req, res) {
  const queue = await loadQueueStatsSafe();
  res.json(queue);
}
