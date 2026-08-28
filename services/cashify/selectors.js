export function cashifyProcessor(value) {
  return String(value || '')
    .replace(/\s*-\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cashifyRam(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d+)\s*GB$/i);
  if (match) return `${match[1]} GB`;
  return raw.replace(/GB/i, 'GB').replace(/(\d)GB/i, '$1 GB');
}

export function cashifyStorage(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export const SCREEN_SIZE = {
  '10-11': '10-11 inch',
  '12-13': '12-13 inch',
  '14-15': '14-15 inch',
  above15: 'Above 15 inch',
};

export const AGE = {
  lessThan1: 'Less than 1 year (in warranty)',
  oneToTwo: 'Between 1 and 3 years',
  twoToThree: 'More than 3 years',
};

export const FUNCTIONAL_LABELS = {
  keyboard: 'Keyboard not working; key(s) missing/not working',
  cdDrive: 'CD/DVD Drive not working',
  trackpad: 'Touchpad not working',
  battery: 'Battery',
  speakers: 'Speakers',
  wifi: 'Wi-Fi not working',
  ports: 'USB Port not working',
  webcam: 'Web Cam not working',
  charging: 'Charging Port not working',
  hardDisk: 'Hard Drive Missing',
  motherboard: 'Motherboard',
  bluetooth: 'Bluetooth not working',
};

export const NEXT_BUTTONS = ['Continue', 'Next', 'Done', 'Get Quote', 'Check Price'];

export function classifyQuestion(text) {
  const q = String(text || '').toLowerCase();
  if (/choose your laptop|system configuration details/.test(q)) return 'config';
  if (/do you have the following|bill available|original box with same serial/.test(q)) return 'accessories';
  if (/additional features|10-11 inch|12-13 inch|above 15 inch|touch screen|graphics card/.test(q)) {
    return 'features';
  }
  if (/functional|keyboard not working|cd\/dvd drive|does your device function/.test(q)) return 'functional';
  if (/scratch on body|dent on top|dent on base|loose hinges|cracked or loose panel|physical condition of your device/.test(q)) {
    return 'physicalDetail';
  }
  if (/age of laptop|age of your device|between 1 and 3 years|less than 1 year \(in warranty\)/.test(q)) {
    return 'age';
  }
  if (/scratch or broken on screen|discolouration on screen|spots on screen|line on screen|no scratches on screen|screen condition/.test(q)) {
    return 'screenDetail';
  }
  if (/software issue|overall condition/.test(q)) return 'overall';
  if (/switch on/.test(q) && /we currently only accept|yes\nno/.test(q)) return 'power';
  if (/switch on\?/.test(q)) return 'power';
  return 'unknown';
}
