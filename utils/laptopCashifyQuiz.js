/** Cashify laptop quiz field → click label mappings (mirrors frontend laptopCashifyQuiz.js). */

export const CASHIFY_BODY_LABELS = {
  bodyScratch: { none: 'No Scratches', minor: 'Minor Scratch on Body', major: 'Major Scratch on Body' },
  dentTop: { none: 'No Dents on top panel', minor2: 'Upto 2 Minor Dents', minorMore2: 'More than 2 Minor Dents', major: '1 or more Major Dents' },
  dentBase: { none: 'No Dents on base panel', minor2: 'Upto 2 Minor Dents', minorMore2: 'More than 2 Minor Dents', major: '1 or more Major Dents' },
  looseHinges: { no: 'No Loose Hinges', yes: 'Yes - Loose Hinges' },
  panelCondition: { none: 'No Cracked or Loose Panel', loose: 'Loose Panel', crack: 'Crack/Damage Panel' },
};

export const CASHIFY_SCREEN_LABELS = {
  screenScratch: { none: 'No scratches on screen', minor12: '1-2 scratches on screen', minorMore2: 'More than 2 scratches on screen', cracked: 'Screen Cracked or Broken' },
  screenDiscolouration: { none: 'No Discolouration', minor: 'Minor Discolouration', major: 'Major Discolouration' },
  screenSpots: { none: 'No spots on screen', minor12: '1-2 minor spots on screen', heavy: 'Large/ heavy visible spots on screen' },
  screenLines: { none: 'No Lines', visible: 'Visible lines on Screen', flickering: 'Display Flickering', blackDots: 'Black Dots on Screen' },
  softwareIssue: { no: 'No software issue', yes: 'Laptop have Software issue' },
};

export const DEFAULT_CASHIFY_BODY = {
  bodyScratch: 'none',
  dentTop: 'none',
  dentBase: 'none',
  looseHinges: 'no',
  panelCondition: 'none',
};

export const DEFAULT_CASHIFY_SCREEN = {
  screenScratch: 'none',
  screenDiscolouration: 'none',
  screenSpots: 'none',
  screenLines: 'none',
  isScreenOriginal: 'yes',
};

export function mergeCashifyBody(quiz) {
  return {
    bodyScratch: quiz.bodyScratch ?? DEFAULT_CASHIFY_BODY.bodyScratch,
    dentTop: quiz.dentTop ?? DEFAULT_CASHIFY_BODY.dentTop,
    dentBase: quiz.dentBase ?? DEFAULT_CASHIFY_BODY.dentBase,
    looseHinges: quiz.looseHinges ?? DEFAULT_CASHIFY_BODY.looseHinges,
    panelCondition: quiz.panelCondition ?? DEFAULT_CASHIFY_BODY.panelCondition,
  };
}

export function mergeCashifyScreen(quiz) {
  return {
    screenScratch: quiz.screenScratch ?? DEFAULT_CASHIFY_SCREEN.screenScratch,
    screenDiscolouration: quiz.screenDiscolouration ?? DEFAULT_CASHIFY_SCREEN.screenDiscolouration,
    screenSpots: quiz.screenSpots ?? DEFAULT_CASHIFY_SCREEN.screenSpots,
    screenLines: quiz.screenLines ?? DEFAULT_CASHIFY_SCREEN.screenLines,
    isScreenOriginal: quiz.isScreenOriginal ?? DEFAULT_CASHIFY_SCREEN.isScreenOriginal,
  };
}

export function bodyLabel(field, key) {
  return CASHIFY_BODY_LABELS[field]?.[key || 'none'] || CASHIFY_BODY_LABELS[field]?.none;
}

export function screenLabel(field, key) {
  const k = key || 'none';
  const primary = CASHIFY_SCREEN_LABELS[field]?.[k] || CASHIFY_SCREEN_LABELS[field]?.none;
  // Cashify UI sometimes includes a trailing space on "No Discolouration".
  if (field === 'screenDiscolouration' && k === 'none') {
    return [primary, 'No Discolouration '].filter(Boolean);
  }
  return primary;
}

export function deriveScreenOverall(screen) {
  if (screen.screenScratch === 'cracked') return 'Damaged';
  if (screen.screenDiscolouration === 'major' || screen.screenSpots === 'heavy') return 'Damaged';
  if (screen.screenScratch !== 'none' || screen.screenDiscolouration !== 'none'
    || screen.screenSpots !== 'none' || screen.screenLines !== 'none') {
    return 'Average';
  }
  if (screen.screenScratch === 'minorMore2') return 'Good';
  return 'Flawless';
}

export function toLegacyBodyIssues(body) {
  const issues = [];
  if (body.bodyScratch === 'minor') issues.push('minorScratch');
  if (body.bodyScratch === 'major') issues.push('majorScratch');
  if (['minor2', 'minorMore2'].includes(body.dentTop)) issues.push('minorDentTop');
  if (body.dentTop === 'major') issues.push('majorDentTop');
  if (['minor2', 'minorMore2'].includes(body.dentBase)) issues.push('minorDentBase');
  if (body.dentBase === 'major') issues.push('majorDentBase');
  if (body.looseHinges === 'yes') issues.push('looseHinges');
  if (body.panelCondition === 'loose') issues.push('loosePanel');
  if (body.panelCondition === 'crack') issues.push('crackedPanel');
  return issues;
}

export function toLegacyScreenIssues(screen) {
  const issues = [];
  if (screen.screenScratch === 'cracked') issues.push('screenCracked');
  if (['minor12', 'minorMore2'].includes(screen.screenScratch)) issues.push('screenScratch');
  if (['minor', 'major'].includes(screen.screenDiscolouration)) issues.push('lineDiscolour');
  if (['minor12', 'heavy'].includes(screen.screenSpots)) issues.push('screenSpots');
  if (['visible', 'flickering', 'blackDots'].includes(screen.screenLines)) issues.push('lineDiscolour');
  return [...new Set(issues)];
}
