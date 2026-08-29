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
  trackpad: 'Touchpad not working; Left/Right click faulty',
  battery: 'Battery dead, backup < 60 mins, health < 80%, cycle count > 800',
  speakers: 'Speakers not working; faulty/cracked sound',
  wifi: 'Wi-Fi not working',
  ports: 'USB Port not working',
  webcam: 'Web Cam not working',
  charging: 'Charging Port not working',
  hardDisk: 'Hard Drive Missing/Defective',
  motherboard: 'Motherboard issue - auto restart, hanging, heating/not booting',
  // Cashify only exposes "Bluetooth Working fine" — skip when user reports bluetooth defect
  bluetooth: null,
};

export const NEXT_BUTTONS = ['Continue', 'Next', 'Done', 'Get Quote', 'Check Price'];

export function classifyQuestion(text) {
  const raw = String(text || '');
  const q = raw.toLowerCase();
  const head = q.slice(0, 220);

  if (/age of your device|age of laptop/.test(head)) return 'age';
  if (/do you have the following/.test(head)) return 'accessories';
  if (/select the screen condition|scratch or broken on screen/.test(head)) return 'screenDetail';
  if (/select the additional features|please select external graphics|additional features/.test(head)) return 'features';
  if (/choose your laptop|system configuration details/.test(head)) return 'config';
  if (/does your device function|functional issues|keyboard not working|touchpad not working/.test(head)) {
    return 'functional';
  }
  if (/does your device switch on|does the laptop switch on/.test(head)) return 'power';
  if (/select the physical condition|physical condition of your device/.test(head)) return 'physicalDetail';
  if (/10-11 inch|12-13 inch|14-15 inch|above 15 inch/.test(q) && /screen|display|size|inch/.test(q)) return 'screenSize';
  if (/touch screen/.test(q)) return 'touchScreen';
  if (/graphics card|external graphics/.test(q)) return 'gpu';
  if (/functional|cd\/dvd drive/.test(q)) return 'functional';
  if (/scratch on body|dent on top|dent on base|loose hinges|cracked or loose panel/.test(q)) {
    return 'physicalDetail';
  }
  if (/scratch or broken on screen|discolouration on screen|spots on screen|line on screen|screen condition/.test(q)) {
    return 'screenDetail';
  }
  if (/software issue|overall condition/.test(q)) return 'overall';
  if (/switch on/.test(q) && /we currently only accept|yes\nno/.test(q)) return 'power';
  if (/switch on\?/.test(q)) return 'power';
  return 'unknown';
}

export const MOBILE_AGE = {
  '0 - 3 Months': '0 - 3 Months',
  '3 - 6 Months': '3 - 6 Months',
  '6 - 11 Months': '6 - 11 Months',
  'Above 11 Months': 'Above 11 Months',
};

export const MOBILE_PHYSICAL_LABELS = {
  glass_crack: 'Glass Crack',
  back_panel: 'Back Panel Damage',
  camera_glass_broken: 'Camera Glass Broken',
};

export const MOBILE_TECHNICAL_LABELS = {
  battery_service: 'Battery Warning',
  front_camera: 'Front Camera faulty',
  back_camera: 'Back Camera faulty',
  volume_button: 'Volume button issue',
  wifi_issue: 'Wifi issue',
  finger_touch: 'Finger touch issue',
  face_unlock: 'Face unlock issue',
  speaker_faulty: 'Speaker faulty',
  power_button: 'Power button issue',
  charging_port: 'Charging port issue',
  audio_receiver: 'Audio receiver issue',
  bluetooth: 'Bluetooth issue',
  vibrator: 'Vibrator issue',
  microphone: 'Microphone issue',
  proximity_sensor: 'Proximity sensor',
};

export function classifyMobileQuestion(text) {
  const q = String(text || '').toLowerCase();
  if (/choose a variant|select variant|pick a variant|select storage|choose storage/.test(q)) return 'variant';
  if (/age of your (mobile|phone|device)|device age|how old is|purchase date|0 - 3 month|above 11 month/.test(q)) {
    return 'age';
  }
  if (/under warranty|valid warranty|warranty status|in warranty|device under warranty/.test(q)) return 'warranty';
  if (/make and receive calls|able to make calls|calls working|receive calls/.test(q)) return 'calls';
  if (/touch screen|touchscreen|touch working|touch functionality/.test(q)) return 'touchscreen';
  if (/original screen|screen replaced|duplicate screen|copy screen/.test(q)) return 'screenOriginal';
  if (/glass crack|back panel|camera glass|physical condition|body condition|external damage/.test(q)) {
    return 'physical';
  }
  if (/battery|front camera|back camera|volume button|wifi|finger|face unlock|speaker|power button|charging port|audio receiver|bluetooth|vibrator|microphone|proximity|technical issue|functional issue|working condition/.test(q)) {
    return 'technical';
  }
  if (/accessories|original box|original charger|valid bill|gst bill|bill available|do you have the following/.test(q)) {
    return 'accessories';
  }
  if (/esim|e-sim|sim support|physical sim/.test(q)) return 'esim';
  if (/switch on|turns on|power on|device switch/.test(q)) return 'power';
  return 'unknown';
}
