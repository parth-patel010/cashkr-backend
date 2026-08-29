import {
  mergeCashifyBody,
  mergeCashifyScreen,
  toLegacyBodyIssues,
  toLegacyScreenIssues,
} from './laptopCashifyQuiz.js';

function yesNoToBool(val) {
  if (val === true || val === false) return val;
  if (val === 'yes') return true;
  if (val === 'no') return false;
  return null;
}

export function normalizeLaptopQuiz(body) {
  const hasGpuRaw = body.hasGpu ?? body.hasDedicatedGpu;
  const hasGpu = yesNoToBool(hasGpuRaw);
  const isGpuWorking = hasGpu === true ? yesNoToBool(body.isGpuWorking) : false;
  const hasTouchRaw = body.hasTouchScreen ?? body.isTouchScreen;
  const hasTouchScreen = yesNoToBool(hasTouchRaw);
  const isTouchScreenWorking = hasTouchScreen === true ? yesNoToBool(body.isTouchScreenWorking) : false;

  const bodyFields = mergeCashifyBody(body);
  const screenFields = mergeCashifyScreen(body);
  const legacyBody = toLegacyBodyIssues(bodyFields);
  const legacyScreen = toLegacyScreenIssues(screenFields);
  const functionalIssues = body.functionalIssues || body.issuesList || [];
  const screenIssues = body.screenIssues?.length
    ? body.screenIssues
    : body.screenIssuesList?.length
      ? body.screenIssuesList
      : legacyScreen;
  const bodyIssues = body.bodyIssues?.length
    ? body.bodyIssues
    : body.bodyIssuesList?.length
      ? body.bodyIssuesList
      : legacyBody;

  return {
    slug: body.slug,
    processor: body.processor || '',
    ram: body.ram || '',
    storage: body.storage || body.storageType || '',
    powerStatus: body.powerStatus || 'on',
    screenSize: body.screenSize || '14-15',
    hasTouchScreen,
    isTouchScreenWorking,
    hasGpu,
    isGpuWorking,
    ...bodyFields,
    ...screenFields,
    softwareIssue: body.softwareIssue || 'no',
    functionalIssues,
    screenIssues,
    bodyIssues,
    accessories: Array.isArray(body.accessories)
      ? body.accessories
      : body.accessories
        ? [body.accessories]
        : [],
    yearBracket: body.yearBracket || body.age || 'oneToTwo',
    age: body.age || body.yearBracket || 'oneToTwo',
    issuesList: body.issuesList || functionalIssues,
    screenIssuesList: body.screenIssuesList || screenIssues,
    bodyIssuesList: body.bodyIssuesList || bodyIssues,
  };
}

export function normalizeMobileQuiz(body) {
  const accessories = body.accessories || [];
  const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
  const hasBill = accList.some((a) => /bill/i.test(String(a))) || body.hasGSTBill === true;

  return {
    slug: body.slug,
    storage: body.storage || '',
    deviceAge: body.deviceAge || 'Above 11 Months',
    ableToMakeCalls: body.ableToMakeCalls !== false,
    isTouchScreenWorking: body.isTouchScreenWorking !== false,
    isScreenOriginal: body.isScreenOriginal !== false,
    underWarranty: body.underWarranty === true,
    eSIMSupport: body.eSIMSupport || 'physical+esim',
    physicalIssues: body.physicalIssues || [],
    technicalIssues: body.technicalIssues || [],
    screenPhysicalDetail: body.screenPhysicalDetail || null,
    panelCondition: body.panelCondition || null,
    bentCondition: body.bentCondition || null,
    hasCharger: accList.some((a) => /charger/i.test(String(a))),
    hasBox: accList.some((a) => /box/i.test(String(a))),
    accessories: hasBill && !accList.some((a) => /bill/i.test(String(a)))
      ? [...accList, 'Bill']
      : accList,
  };
}

export function normalizeQuizForCategory(body, category) {
  if (category === 'mobile') return normalizeMobileQuiz(body);
  if (category === 'laptop' || category === 'mac') return normalizeLaptopQuiz(body);
  return null;
}
