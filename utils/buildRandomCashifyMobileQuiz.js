/** Build random Cashify-parity mobile quiz payloads for click verification. */

const MOBILE_AGES = ['0 - 3 Months', '3 - 6 Months', '6 - 11 Months', 'Above 11 Months'];

const PHYSICAL_IDS = ['glass_crack', 'back_panel', 'camera_glass_broken'];

const TECHNICAL_IDS = [
  'battery_service', 'front_camera', 'back_camera', 'volume_button', 'wifi_issue',
  'finger_touch', 'face_unlock', 'speaker_faulty', 'power_button', 'charging_port',
  'audio_receiver', 'bluetooth', 'vibrator', 'microphone', 'proximity_sensor',
];

const ACCESSORY_OPTS = ['Bill', 'Box', 'Charger'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSubset(arr, maxCount) {
  const n = Math.floor(Math.random() * (maxCount + 1));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function bool(probability = 0.5) {
  return Math.random() < probability;
}

export function buildRandomCashifyMobileQuiz(mobile, config = {}) {
  const picked = config.picked || {};
  const storages = config.storages || ['6GB / 128GB'];

  return {
    slug: mobile.slug,
    brand: mobile.brand,
    modelName: mobile.modelName || mobile.model || '',
    storage: picked.storage || pick(storages),
    deviceAge: pick(MOBILE_AGES),
    underWarranty: bool(0.45),
    ableToMakeCalls: bool(0.92),
    isTouchScreenWorking: bool(0.9),
    isScreenOriginal: bool(0.82),
    physicalIssues: pickSubset(PHYSICAL_IDS, 2),
    technicalIssues: pickSubset(TECHNICAL_IDS, 4),
    accessories: pickSubset(ACCESSORY_OPTS, 3),
    eSIMSupport: bool(0.15) ? 'esim_only_global' : 'physical+esim',
  };
}

export function mobileQuizSummaryLine(quiz) {
  const phys = (quiz.physicalIssues || []).join(',') || 'none';
  const tech = (quiz.technicalIssues || []).join(',') || 'none';
  const acc = (quiz.accessories || []).join(',') || 'none';
  return [
    `storage=${quiz.storage}`,
    `age=${quiz.deviceAge}`,
    `warranty=${quiz.underWarranty ? 'yes' : 'no'}`,
    `calls=${quiz.ableToMakeCalls ? 'yes' : 'no'}`,
    `touch=${quiz.isTouchScreenWorking ? 'yes' : 'no'}`,
    `screenOrig=${quiz.isScreenOriginal ? 'yes' : 'no'}`,
    `phys=[${phys}]`,
    `tech=[${tech}]`,
    `acc=[${acc}]`,
  ].join(' | ');
}
