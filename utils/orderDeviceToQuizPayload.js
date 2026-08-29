import { normalizeLaptopQuiz, normalizeMobileQuiz } from './quizNormalize.js';

export function orderDeviceToQuizPayload(device) {
  if (!device?.slug) return null;
  const category = device.category;
  if (category === 'mobile') {
    return normalizeMobileQuiz({
      slug: device.slug,
      storage: device.storage,
      deviceAge: device.deviceAge,
      ableToMakeCalls: device.ableToMakeCalls,
      isTouchScreenWorking: device.isTouchScreenWorking,
      isScreenOriginal: device.isScreenOriginal,
      underWarranty: device.underWarranty,
      eSIMSupport: device.eSIMSupport,
      physicalIssues: device.physicalIssues,
      technicalIssues: device.technicalIssues,
      accessories: device.accessories,
      hasGSTBill: device.hasGSTBill,
      screenPhysicalDetail: device.screenPhysicalDetail,
      panelCondition: device.panelCondition,
      bentCondition: device.bentCondition,
    });
  }
  if (category === 'laptop' || category === 'mac') {
    return normalizeLaptopQuiz({
      slug: device.slug,
      processor: device.processor,
      ram: device.ram,
      storage: device.storage || device.storageType,
      powerStatus: device.powerStatus,
      screenSize: device.screenSize,
      hasGpu: device.hasDedicatedGpu ?? device.hasGpu,
      isGpuWorking: device.isGpuWorking,
      functionalIssues: device.functionalIssues,
      screenIssues: device.screenIssues,
      bodyIssues: device.bodyIssues,
      accessories: device.accessories,
      yearBracket: device.yearBracket || device.yearOfPurchase,
      age: device.yearBracket,
    });
  }
  return null;
}
