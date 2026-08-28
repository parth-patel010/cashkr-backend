const IDENTITY_KEYS = new Set(['slug', 'storage', 'category', 'brand', 'modelName']);

const MOBILE_CONDITION_KEYS = [
  'deviceAge',
  'ableToMakeCalls',
  'isTouchScreenWorking',
  'isScreenOriginal',
  'underWarranty',
  'eSIMSupport',
  'physicalIssues',
  'technicalIssues',
  'accessories',
  'hasCharger',
  'hasBox',
  'hasGSTBill',
];

const LAPTOP_CONDITION_KEYS = [
  'powerStatus',
  'screenSize',
  'hasGpu',
  'hasDedicatedGpu',
  'isGpuWorking',
  'functionalIssues',
  'screenIssues',
  'bodyIssues',
  'accessories',
  'yearBracket',
  'age',
  'yearOfPurchase',
  'processor',
  'ram',
  'issuesList',
  'screenIssuesList',
  'bodyIssuesList',
];

function payloadHasConditionAnswers(payload = {}, keys = []) {
  return keys.some((key) => {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) return false;
    const value = payload[key];
    if (Array.isArray(value)) return true;
    if (value === null || value === undefined || value === '') return false;
    return true;
  });
}

/**
 * True when the record has real quiz answers worth running the Cashify agent on.
 * Uses raw/source payload — not normalized defaults.
 */
export function hasFilledQuizFromSource(quizPayload = {}, quizSummary = [], category) {
  if (Array.isArray(quizSummary) && quizSummary.length > 0) return true;

  const payload = quizPayload && typeof quizPayload === 'object' ? quizPayload : {};
  const extraKeys = Object.keys(payload).filter((k) => !IDENTITY_KEYS.has(k));
  if (!extraKeys.length) return false;

  if (category === 'mobile') {
    return payloadHasConditionAnswers(payload, MOBILE_CONDITION_KEYS);
  }
  if (category === 'laptop' || category === 'mac') {
    return payloadHasConditionAnswers(payload, LAPTOP_CONDITION_KEYS);
  }
  return false;
}

/** Mongo filter: records eligible for the pricing agent UI / worker. */
export function pricingAgentEligibleFilter() {
  return {
    $or: [
      { hasFilledQuiz: true },
      { 'quizSummary.0': { $exists: true } },
      { sourceType: 'order' },
    ],
  };
}
