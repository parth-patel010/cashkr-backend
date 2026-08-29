/** Build fully random Cashify-parity laptop quiz payloads for click verification. */

const FUNCTIONAL_IDS = [
  'keyboard', 'cdDrive', 'trackpad', 'battery', 'speakers', 'wifi',
  'ports', 'webcam', 'charging', 'hardDisk', 'motherboard',
];

const AGES = ['lessThan1', 'oneToTwo', 'twoToThree'];
const SCREEN_SIZES = ['10-11', '12-13', '14-15', 'above15'];
const ACCESSORY_OPTS = ['box', 'bill', 'charger'];

const BODY_SCRATCH = ['none', 'minor', 'major'];
const DENT = ['none', 'minor2', 'minorMore2', 'major'];
const LOOSE_HINGES = ['no', 'yes'];
const PANEL = ['none', 'loose', 'crack'];

const SCREEN_SCRATCH = ['none', 'minor12', 'minorMore2', 'cracked'];
const SCREEN_DISCOLOUR = ['none', 'minor', 'major'];
const SCREEN_SPOTS = ['none', 'minor12', 'heavy'];
const SCREEN_LINES = ['none', 'visible', 'flickering', 'blackDots'];
const SCREEN_ORIGINAL = ['yes', 'no'];
const SOFTWARE = ['no', 'yes'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSubset(arr, maxCount) {
  const n = Math.floor(Math.random() * (maxCount + 1));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function isGamingModel(name = '') {
  return /nitro|tuf|legion|omen|alienware|rog|gaming|g15|g16|predator|victus|katana|crosshair/i.test(name);
}

export function buildRandomCashifyQuiz(laptop, config = {}) {
  const model = laptop.modelName || laptop.model || '';
  const gaming = isGamingModel(model);
  const hasGpu = gaming || Math.random() < 0.2;
  const hasTouch = Math.random() < 0.25;
  const picked = config.picked || {};

  const functionalIssues = pickSubset(FUNCTIONAL_IDS, 3);

  return {
    slug: laptop.slug,
    brand: laptop.brand,
    modelName: model,
    processor: picked.processor || pick(config.processors || ['Intel Core i5 12th Gen']),
    ram: picked.ram || pick(config.rams || ['16 GB']),
    storage: picked.storage || pick(config.storages || ['512 GB SSD']),
    powerStatus: Math.random() < 0.97 ? 'on' : 'off',
    screenSize: pick(SCREEN_SIZES),
    hasTouchScreen: hasTouch,
    isTouchScreenWorking: hasTouch && Math.random() < 0.15 ? false : true,
    hasGpu,
    isGpuWorking: hasGpu && Math.random() < 0.12 ? false : true,
    functionalIssues,
    issuesList: functionalIssues,
    bodyScratch: pick(BODY_SCRATCH),
    dentTop: pick(DENT),
    dentBase: pick(DENT),
    looseHinges: pick(LOOSE_HINGES),
    panelCondition: pick(PANEL),
    screenScratch: pick(SCREEN_SCRATCH),
    screenDiscolouration: pick(SCREEN_DISCOLOUR),
    screenSpots: pick(SCREEN_SPOTS),
    screenLines: pick(SCREEN_LINES),
    isScreenOriginal: pick(SCREEN_ORIGINAL),
    softwareIssue: pick(SOFTWARE),
    accessories: pickSubset(ACCESSORY_OPTS, 3),
    age: pick(AGES),
    yearBracket: pick(AGES),
  };
}

export function quizSummaryLine(quiz) {
  const func = (quiz.functionalIssues || quiz.issuesList || []).join(',') || 'none';
  return [
    `power=${quiz.powerStatus}`,
    `touch=${quiz.hasTouchScreen ? (quiz.isTouchScreenWorking ? 'ok' : 'bad') : 'no'}`,
    `gpu=${quiz.hasGpu ? (quiz.isGpuWorking ? 'ok' : 'bad') : 'no'}`,
    `func=[${func}]`,
    `body=${quiz.bodyScratch}/${quiz.dentTop}/${quiz.dentBase}/hinges=${quiz.looseHinges}/panel=${quiz.panelCondition}`,
    `screen=${quiz.screenScratch}/${quiz.screenDiscolouration}/${quiz.screenSpots}/${quiz.screenLines}/orig=${quiz.isScreenOriginal}`,
    `sw=${quiz.softwareIssue}`,
    `age=${quiz.age}`,
  ].join(' | ');
}
