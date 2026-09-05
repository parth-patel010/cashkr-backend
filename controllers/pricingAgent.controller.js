import PricingQuizRecord from '../models/PricingQuizRecord.js';
import AppSettings from '../models/AppSettings.js';
import { serializePricingRecord } from '../utils/pricingQuizService.js';
import { pricingAgentEligibleFilter } from '../utils/quizFilled.js';
import {
  buildPricingRecordsWorkbook,
  buildPricingRecordsCsv,
  buildPricingRecordsJsonl,
} from '../utils/pricingAgentExport.js';
import {
  enqueueAllPending,
  enqueueOneRecord,
  syncPricingRecordsFromSources,
  startPricingAgentWorker,
} from '../services/cashify/batchWorker.js';
import {
  DEFAULT_PRICING_BRACKETS,
  normalizeBracketList,
  invalidatePricingBracketCache,
  loadPricingBracketSettings,
} from '../utils/offerMarkup.js';
import { ensureAppSettings } from './appSettings.controller.js';

/** Interpret YYYY-MM-DD as an IST calendar day (matches admin date picker). */
function istDayBoundary(isoDate, endOfDay = false) {
  const [y, m, d] = String(isoDate).split('-').map(Number);
  const istMidnightUtc = Date.UTC(y, m - 1, d) - (5.5 * 60 * 60 * 1000);
  if (!endOfDay) return new Date(istMidnightUtc);
  return new Date(istMidnightUtc + (24 * 60 * 60 * 1000) - 1);
}

function buildActivityDateFilter(fromDate, toDate) {
  if (!fromDate && !toDate) return {};
  const range = {};
  if (fromDate) range.$gte = istDayBoundary(fromDate, false);
  if (toDate) range.$lte = istDayBoundary(toDate, true);
  return {
    $or: [
      { capturedAt: range },
      { updatedAt: range },
      { runAt: range },
      { completedAt: range },
      { createdAt: range },
    ],
  };
}

function buildPricingAgentQueryFilter(query = {}) {
  const filter = { ...pricingAgentEligibleFilter() };
  const dateFilter = buildActivityDateFilter(query.fromDate, query.toDate);
  if (dateFilter.$or) Object.assign(filter, dateFilter);
  if (query.status) filter.agentStatus = query.status;
  if (query.category) filter.category = query.category;
  if (query.clientPlatform === 'App' || query.clientPlatform === 'Website') {
    filter.clientPlatform = query.clientPlatform;
  }
  return filter;
}

export const getPricingAgentStats = async (req, res, next) => {
  try {
    const baseFilter = buildPricingAgentQueryFilter(req.query);
    const statuses = ['pending', 'running', 'completed', 'partial', 'failed', 'skipped', 'overridden'];
    const counts = await Promise.all(
      statuses.map((s) => PricingQuizRecord.countDocuments({ ...baseFilter, agentStatus: s })),
    );
    const stats = Object.fromEntries(statuses.map((s, i) => [s, counts[i]]));
    stats.overridden = (stats.overridden || 0) + (stats.skipped || 0);
    stats.total = counts.reduce((a, b) => a + b, 0);
    res.json({
      stats,
      fromDate: req.query.fromDate || null,
      toDate: req.query.toDate || null,
    });
  } catch (error) {
    next(error);
  }
};

export const getPricingAgentRecords = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const skip = (page - 1) * limit;
    const filter = buildPricingAgentQueryFilter(req.query);

    const [records, total] = await Promise.all([
      PricingQuizRecord.find(filter).sort({ updatedAt: -1, capturedAt: -1 }).skip(skip).limit(limit).lean(),
      PricingQuizRecord.countDocuments(filter),
    ]);

    res.json({
      records: records.map(serializePricingRecord),
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      fromDate: req.query.fromDate || null,
      toDate: req.query.toDate || null,
    });
  } catch (error) {
    next(error);
  }
};

export const syncPricingAgent = async (req, res, next) => {
  try {
    const result = await syncPricingRecordsFromSources();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const runAllPricingAgent = async (req, res, next) => {
  try {
    startPricingAgentWorker();
    const result = await enqueueAllPending();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const runOnePricingAgent = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    if (!recordId) {
      return res.status(400).json({ message: 'recordId is required' });
    }
    startPricingAgentWorker();
    const result = await enqueueOneRecord(recordId);
    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ message: result.message });
    }
    if (result.error) {
      return res.status(400).json({ message: result.message });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPricingAgentSettings = async (req, res, next) => {
  try {
    await ensureAppSettings();
    const settings = await loadPricingBracketSettings({ force: true });
    res.json({
      mobileBrackets: settings.mobile,
      laptopBrackets: settings.laptop,
      fallbackFixedInr: settings.fallbackFixedInr,
      defaults: DEFAULT_PRICING_BRACKETS,
    });
  } catch (error) {
    next(error);
  }
};

export const savePricingAgentSettings = async (req, res, next) => {
  try {
    await ensureAppSettings();
    const mobileBrackets = normalizeBracketList(
      req.body?.mobileBrackets,
      DEFAULT_PRICING_BRACKETS.mobile,
    );
    const laptopBrackets = normalizeBracketList(
      req.body?.laptopBrackets,
      DEFAULT_PRICING_BRACKETS.laptop,
    );
    const fallbackFixedInr = Number.isFinite(Number(req.body?.fallbackFixedInr))
      ? Math.max(0, Number(req.body.fallbackFixedInr))
      : 1000;

    const doc = await AppSettings.findOneAndUpdate(
      { key: 'default' },
      {
        $set: {
          pricingAgent: {
            mobileBrackets,
            laptopBrackets,
            fallbackFixedInr,
          },
        },
      },
      { new: true },
    );

    invalidatePricingBracketCache();
    res.json({
      message: 'Pricing brackets saved',
      mobileBrackets: normalizeBracketList(doc?.pricingAgent?.mobileBrackets, DEFAULT_PRICING_BRACKETS.mobile),
      laptopBrackets: normalizeBracketList(doc?.pricingAgent?.laptopBrackets, DEFAULT_PRICING_BRACKETS.laptop),
      fallbackFixedInr: doc?.pricingAgent?.fallbackFixedInr ?? fallbackFixedInr,
    });
  } catch (error) {
    next(error);
  }
};

export const exportPricingAgent = async (req, res, next) => {
  try {
    const format = String(req.query.format || 'xlsx').toLowerCase();
    const limit = Math.min(Number(req.query.limit) || 5000, 10000);
    const filter = buildPricingAgentQueryFilter(req.query);
    const records = await PricingQuizRecord.find(filter)
      .sort({ updatedAt: -1, capturedAt: -1 })
      .limit(limit)
      .lean();

    if (!records.length) {
      return res.status(404).json({ error: 'No pricing records to export.' });
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

    if (format === 'csv') {
      const csv = buildPricingRecordsCsv(records);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="pricing-agent-${stamp}.csv"`);
      return res.send('\uFEFF' + csv);
    }

    if (format === 'jsonl') {
      const jsonl = buildPricingRecordsJsonl(records);
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="pricing-agent-${stamp}.jsonl"`);
      return res.send(jsonl);
    }

    const buffer = buildPricingRecordsWorkbook(records);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="pricing-agent-${stamp}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
