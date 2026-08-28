import { isSpecialModel } from './specialModels.js';

export const ISSUE_DEDUCTIONS = {
  glass_crack: 40,
  back_panel: 17,
  camera_glass_broken: 8,
  battery_service: 13,
  front_camera: 8,
  back_camera: 15,
  volume_button: 4,
  wifi_issue: 39,
  finger_touch: 26,
  face_unlock: 26,
  speaker_faulty: 4,
  power_button: 2,
  charging_port: 10,
  audio_receiver: 7,
  bluetooth: 39,
  vibrator: 2,
  microphone: 2,
  proximity_sensor: 3,
};

/**
 * Mobile v2 price calculator — matches frontend priceCalculator.js calculatePrice().
 */
export function calculateMobilePrice({
  brand,
  modelName,
  basePrice,
  deviceAge,
  ableToMakeCalls,
  isTouchScreenWorking,
  isScreenOriginal,
  underWarranty,
  eSIMSupport,
  physicalIssues = [],
  technicalIssues = [],
  hasCharger,
  hasBox,
}) {
  const breakdown = {};
  let currentPrice = basePrice;
  const isSpecial = isSpecialModel(brand, modelName);

  const applyDeduction = (key, pct) => {
    const deduction = Math.round(currentPrice * (pct / 100));
    breakdown[key] = pct;
    currentPrice = Math.max(currentPrice - deduction, 0);
  };

  const ageDeductions = { '0 - 3 Months': 0, '3 - 6 Months': 7, '6 - 11 Months': 10, 'Above 11 Months': 15 };
  const agePct = isSpecial ? 0 : (ageDeductions[deviceAge] ?? 7);
  if (agePct > 0) applyDeduction('age', agePct);

  if (ableToMakeCalls === false) applyDeduction('dead', 90);
  if (isTouchScreenWorking === false) applyDeduction('screenFaulty', 65);
  if (isScreenOriginal === false) applyDeduction('copyScreen', 27);
  if (!isSpecial && underWarranty === false && deviceAge !== 'Above 11 Months') {
    applyDeduction('outOfWarranty', 0);
  }
  if (eSIMSupport === 'esim_only_global') applyDeduction('eSIM', 6);
  if (hasCharger === false) applyDeduction('noCharger', 3);
  if (hasBox === false) applyDeduction('noBox', 5);

  for (const id of [...physicalIssues, ...technicalIssues]) {
    const pct = ISSUE_DEDUCTIONS[id];
    if (pct > 0) applyDeduction(`issue_${id}`, pct);
  }

  const totalDeductionPct = basePrice > 0
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  return {
    basePrice,
    totalDeductionPct,
    breakdown,
    finalPrice: Math.max(currentPrice, 0),
    priceSource: 'mobile_v2_calculator',
  };
}
