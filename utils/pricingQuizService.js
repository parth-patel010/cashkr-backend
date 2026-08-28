import Device from '../models/Device.js';
import PricingQuizRecord from '../models/PricingQuizRecord.js';
import { calculateLaptopPrice } from './laptopPriceCalculator.js';
import { calculateMobilePrice } from './mobilePriceCalculator.js';
import { hashQuizPayload } from './quizHash.js';
import { normalizeQuizForCategory } from './quizNormalize.js';
import { hasFilledQuizFromSource, hasMeaningfulQuizSummary } from './quizFilled.js';
import { buildQuizSummaryFromPayload } from './buildQuizSummary.js';

function resolveVariantBasePrice(device, storage, ram) {
  const variants = device.variants || [];
  if (!variants.length) return 0;
  const match = variants.find((v) => {
    const storageMatch = !storage || v.storage === storage;
    const ramMatch = !ram || !v.ram || v.ram === ram;
    return storageMatch && ramMatch;
  });
  return match?.basePrice ?? variants[0]?.basePrice ?? 0;
}

export function computeInternalPrice(device, quiz, category) {
  if (category === 'laptop' || category === 'mac') {
    const deviceObj = device.toObject ? device.toObject() : device;
    const result = calculateLaptopPrice(deviceObj, {
      ram: quiz.ram || deviceObj.variants?.[0]?.ram || '',
      storage: quiz.storage || deviceObj.variants?.[0]?.storage || '',
      processor: quiz.processor || deviceObj.variants?.[0]?.processor || deviceObj.processorFamily || '',
      yearBracket: quiz.yearBracket,
      powerStatus: quiz.powerStatus || 'on',
      screenSize: quiz.screenSize || '14-15',
      hasGpu: !!quiz.hasGpu,
      isGpuWorking: !!quiz.isGpuWorking,
      functionalIssues: quiz.functionalIssues,
      screenIssues: quiz.screenIssues,
      bodyIssues: quiz.bodyIssues,
      accessories: quiz.accessories?.length ? quiz.accessories : ['none'],
    });
    if (!result) return null;
    return {
      finalPrice: result.internalPrice ?? result.componentFinalPrice ?? result.finalPrice,
      breakdown: result,
    };
  }

  if (category === 'mobile') {
    const basePrice = resolveVariantBasePrice(device, quiz.storage);
    const result = calculateMobilePrice({
      brand: device.brand,
      modelName: device.modelName,
      basePrice,
      deviceAge: quiz.deviceAge,
      ableToMakeCalls: quiz.ableToMakeCalls,
      isTouchScreenWorking: quiz.isTouchScreenWorking,
      isScreenOriginal: quiz.isScreenOriginal,
      underWarranty: quiz.underWarranty,
      eSIMSupport: quiz.eSIMSupport,
      physicalIssues: quiz.physicalIssues,
      technicalIssues: quiz.technicalIssues,
      hasCharger: quiz.hasCharger,
      hasBox: quiz.hasBox,
    });
    return { finalPrice: result.finalPrice, breakdown: result };
  }

  return null;
}

export function serializePricingRecord(doc) {
  const r = doc.toObject ? doc.toObject() : doc;
  return {
    id: r._id,
    slug: r.slug,
    category: r.category,
    brand: r.brand,
    modelName: r.modelName,
    storage: r.storage,
    quizSummary: r.quizSummary || [],
    quizPayload: r.quizPayload,
    quizHash: r.quizHash,
    sourceType: r.sourceType,
    sourceId: r.sourceId,
    internalPrice: r.internalPrice,
    cashifyPrice: r.cashifyPrice,
    ourOffer: r.ourOffer,
    difference: r.difference,
    agentStatus: r.agentStatus,
    cashifyProductUrl: r.cashifyProductUrl,
    error: r.error,
    note: r.note,
    durationMs: r.durationMs,
    capturedAt: r.capturedAt,
    runAt: r.runAt,
    completedAt: r.completedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function upsertPricingQuizRecord({
  slug,
  category,
  brand,
  modelName,
  storage,
  quizPayload,
  quizSummary = [],
  sourceType = 'user_quiz',
  sourceId = '',
}) {
  const allowed = ['mobile', 'laptop', 'mac'];
  if (!allowed.includes(category)) return null;

  const filled = hasFilledQuizFromSource(quizPayload, quizSummary, category);
  if (!filled) return null;

  const normalized = normalizeQuizForCategory({ ...quizPayload, slug }, category);
  if (!normalized) return null;

  let summary = Array.isArray(quizSummary) ? quizSummary : [];
  if (!hasMeaningfulQuizSummary(summary)) {
    summary = buildQuizSummaryFromPayload({ ...quizPayload, ...normalized }, category);
  }
  if (!hasMeaningfulQuizSummary(summary)) return null;

  const quizHash = hashQuizPayload(normalized);
  const device = await Device.findOne({ slug, isActive: true });
  if (!device) return null;

  const internal = computeInternalPrice(device, normalized, category);
  const internalPrice = internal?.finalPrice ?? null;

  const existingCompleted = await PricingQuizRecord.findOne({
    slug,
    quizHash,
    agentStatus: { $in: ['completed', 'partial'] },
  }).lean();

  const update = {
    category,
    brand: brand || device.brand,
    modelName: modelName || device.modelName,
    storage: storage || normalized.storage || '',
    quizPayload: normalized,
    quizSummary: summary,
    sourceType,
    sourceId: String(sourceId || ''),
    internalPrice,
    capturedAt: new Date(),
    hasFilledQuiz: true,
  };

  if (existingCompleted) {
    update.agentStatus = 'skipped';
    update.cashifyPrice = existingCompleted.cashifyPrice;
    update.ourOffer = existingCompleted.ourOffer;
    update.difference = existingCompleted.difference;
    update.cashifyProductUrl = existingCompleted.cashifyProductUrl || '';
    update.note = 'Already completed for this device + quiz.';
    update.completedAt = existingCompleted.completedAt || new Date();
  } else {
    const current = await PricingQuizRecord.findOne({ slug, quizHash }).lean();
    if (!current || ['failed', 'pending'].includes(current.agentStatus)) {
      update.agentStatus = 'pending';
    }
  }

  const record = await PricingQuizRecord.findOneAndUpdate(
    { slug, quizHash },
    { $set: update, $setOnInsert: { slug, quizHash } },
    { upsert: true, new: true },
  );

  return record;
}

export async function findCompletedByHash(slug, quizHash) {
  return PricingQuizRecord.findOne({
    slug,
    quizHash,
    agentStatus: { $in: ['completed', 'partial'] },
    cashifyPrice: { $ne: null },
  }).lean();
}
