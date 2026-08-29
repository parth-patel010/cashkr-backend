import Device from '../models/Device.js';
import PricingQuizRecord from '../models/PricingQuizRecord.js';
import { orderDeviceToQuizPayload } from './orderDeviceToQuizPayload.js';
import { hashQuizPayload } from './quizHash.js';
import {
  computeInternalPrice,
  findCachedValuationByHash,
} from './pricingQuizService.js';

const AGENT_STATUSES = ['completed', 'partial', 'skipped', 'overridden'];

function buildLockedBreakdown(priceBreakdown, fields) {
  return {
    ...priceBreakdown,
    ...fields,
    finalPrice: fields.lockedPrice,
    quotedFinalPrice: fields.lockedPrice,
  };
}

async function loadValuationRecord({ valuationRecordId, slug, quizHash }) {
  if (valuationRecordId) {
    const byId = await PricingQuizRecord.findById(valuationRecordId).lean();
    if (byId?.ourOffer != null && AGENT_STATUSES.includes(byId.agentStatus)) {
      return byId;
    }
  }
  if (slug && quizHash) {
    return findCachedValuationByHash(slug, quizHash);
  }
  return null;
}

async function validateCalculatorPrice(device, category, clientPrice, priceBreakdown) {
  const quiz = orderDeviceToQuizPayload(device);
  if (!quiz) {
    return { error: 'INVALID_QUIZ', message: 'Device quiz data is incomplete. Please restart your valuation.' };
  }

  const quizHash = hashQuizPayload(quiz);
  const deviceDoc = await Device.findOne({ slug: device.slug, isActive: true });
  if (!deviceDoc) {
    return { error: 'DEVICE_NOT_FOUND', message: 'Device not found.' };
  }

  const computed = computeInternalPrice(deviceDoc, quiz, category);
  const expectedPrice = computed?.finalPrice;
  if (expectedPrice == null) {
    return { error: 'PRICE_CALC_FAILED', message: 'Unable to verify offer price. Please restart your valuation.' };
  }

  if (Number(clientPrice) !== Number(expectedPrice)) {
    return {
      error: 'PRICE_MISMATCH',
      message: `Offer price does not match your valuation (₹${expectedPrice}). Please refresh your quote and try again.`,
    };
  }

  return {
    priceBreakdown: buildLockedBreakdown(priceBreakdown, {
      lockedPrice: expectedPrice,
      priceSource: priceBreakdown?.priceSource || computed?.breakdown?.priceSource || `${category}_calculator`,
      quizHash,
    }),
  };
}

export async function resolveLockedOrderPrice({ device, priceBreakdown = {}, priceLock = {} }) {
  const category = device?.category || '';
  const clientPrice = Number(
    priceLock?.lockedPrice ?? priceBreakdown?.finalPrice ?? priceBreakdown?.quotedFinalPrice ?? 0,
  );

  if (!Number.isFinite(clientPrice) || clientPrice <= 0) {
    return {
      error: 'INVALID_PRICE',
      message: 'A valid locked offer price is required to place an order.',
    };
  }

  const quiz = orderDeviceToQuizPayload(device);
  const quizHash = priceLock?.quizHash || (quiz ? hashQuizPayload(quiz) : null);

  if (['laptop', 'mac'].includes(category)) {
    const record = await loadValuationRecord({
      valuationRecordId: priceLock?.valuationRecordId,
      slug: device?.slug,
      quizHash,
    });

    if (record?.ourOffer != null) {
      const lockedPrice = Number(record.ourOffer);
      if (Number(clientPrice) !== lockedPrice) {
        return {
          error: 'PRICE_MISMATCH',
          message: `Offer price changed since valuation (₹${lockedPrice}). Please re-run valuation before placing your order.`,
        };
      }

      const priceSource = priceBreakdown?.priceSource
        || (['skipped', 'overridden'].includes(record.agentStatus) ? 'valuation_cache' : 'agent_valuation');

      return {
        priceBreakdown: buildLockedBreakdown(priceBreakdown, {
          lockedPrice,
          priceSource,
          agentStatus: record.agentStatus,
          cashifyEstimate: record.cashifyPrice,
          internalPrice: record.internalPrice,
          quizHash: record.quizHash || quizHash,
          valuationRecordId: String(record._id),
        }),
      };
    }

    if (category === 'laptop') {
      return {
        error: 'NO_LOCKED_VALUATION',
        message: 'No valid valuation found for this laptop. Please complete the live valuation again before placing your order.',
      };
    }

    return validateCalculatorPrice(device, 'mac', clientPrice, priceBreakdown);
  }

  if (category === 'mobile') {
    const record = await loadValuationRecord({
      valuationRecordId: priceLock?.valuationRecordId,
      slug: device?.slug,
      quizHash,
    });

    if (record?.ourOffer != null) {
      const lockedPrice = Number(record.ourOffer);
      if (Number(clientPrice) !== lockedPrice) {
        return {
          error: 'PRICE_MISMATCH',
          message: `Offer price changed since valuation (₹${lockedPrice}). Please refresh your quote and try again.`,
        };
      }

      return {
        priceBreakdown: buildLockedBreakdown(priceBreakdown, {
          lockedPrice,
          priceSource: priceBreakdown?.priceSource || 'agent_valuation',
          agentStatus: record.agentStatus,
          cashifyEstimate: record.cashifyPrice,
          internalPrice: record.internalPrice,
          quizHash: record.quizHash || quizHash,
          valuationRecordId: String(record._id),
        }),
      };
    }

    return validateCalculatorPrice(device, 'mobile', clientPrice, priceBreakdown);
  }

  return {
    priceBreakdown: buildLockedBreakdown(priceBreakdown, {
      lockedPrice: clientPrice,
      priceSource: priceBreakdown?.priceSource || 'client_quote',
      quizHash: quizHash || undefined,
    }),
  };
}
