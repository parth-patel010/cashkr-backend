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
  glass_crack: 'Broken/scratch on device screen',
  screen_spot: 'Dead Spot/Visible line and Discoloration on screen',
  back_panel: 'Scratch/Dent on device body',
  panel_missing: 'Device panel missing/broken',
  // Prefer technical page for Camera Glass Broken (merged in mobileFlow);
  // also try exact label if Cashify shows it on the physical multi-select.
  camera_glass_broken: 'Camera Glass Broken',
};

export const MOBILE_SCREEN_PHYSICAL_DEFAULT = '1-2 scratches on screen';

export const MOBILE_SCREEN_PHYSICAL_DETAIL_LABELS = {
  minor12: '1-2 scratches on screen',
  more2: 'More than 2 scratches on screen',
  cracked: 'Screen cracked/ glass broken',
  chipped: 'Chipped/cracked outside display area',
};

export const MOBILE_PANEL_CONDITION_LABELS = {
  none: 'No defect on side or back panel',
  cracked: 'Cracked/ broken side or back panel',
  missing: 'Missing side or back panel',
};

export const MOBILE_BENT_CONDITION_LABELS = {
  none: 'Phone not bent',
  loose: 'Loose screen (Gap in screen and body)',
  bent: 'Bent/ curved panel',
};

export const MOBILE_TECHNICAL_LABELS = {
  battery_service: 'Battery Faulty',
  front_camera: 'Front Camera not working',
  back_camera: 'Back Camera not working',
  volume_button: 'Volume Button not working',
  wifi_issue: 'WiFi not working',
  finger_touch: 'Finger Touch not working',
  face_unlock: 'Face Sensor not working',
  speaker_faulty: 'Speaker Faulty',
  power_button: 'Power Button not working',
  charging_port: 'Charging Port not working',
  audio_receiver: 'Audio Receiver not working',
  bluetooth: 'Bluetooth not working',
  vibrator: 'Vibrator is not working',
  microphone: 'Microphone not working',
  proximity_sensor: 'Proximity Sensor not working',
  camera_glass_broken: 'Camera Glass Broken',
  silent_button: 'Silent Button not working',
};

export function classifyMobileQuestion(text) {
  const raw = String(text || '');
  const head = raw.toLowerCase().split('\n').slice(0, 10).join('\n');
  const q = raw.toLowerCase();

  if (/choose a variant|select variant|pick a variant|select storage|choose storage/.test(head)) return 'variant';
  if (/age of your (mobile|phone|device)|device age|how old is|purchase date|0 - 3 month|above 11 month/.test(head)) {
    return 'age';
  }
  if (/under warranty|valid warranty|warranty status|in warranty|device under warranty/.test(head)) return 'warranty';
  if (/tell us more about your device screen defects|screen physical condition|screen cracked\/ glass broken|1-2 scratches on screen/.test(head)) {
    return 'screenPhysicalDetail';
  }
  if (/tell us more about your device's body defects|panel condition|device bent|side\/back panel|scratches on device body|dents on device body|1-2 minor dents/.test(head)) {
    return 'bodyPhysicalDetail';
  }
  if (/select screen\/body defects|screen\/body defects that are applicable/.test(head)) {
    return 'physical';
  }
  if (/functional or physical problems|front camera not working|battery faulty/.test(head)) {
    return 'technical';
  }
  if (/tell us more about your device\?|please answer a few questions about your device/.test(head)) {
    return 'generalScreen';
  }
  if (/make and receive calls/.test(head) && /touch screen/.test(head)) return 'generalScreen';
  if (/make and receive calls|able to make calls|calls working|receive calls/.test(head)) return 'calls';
  if (/touch screen|touchscreen|touch working|touch functionality/.test(head)) return 'touchscreen';
  if (/original screen|screen replaced|duplicate screen|copy screen/.test(head)) return 'screenOriginal';
  if (/glass crack|back panel|camera glass|physical condition|body condition|external damage/.test(head)) {
    return 'physical';
  }
  if (/technical issue|functional issue|working condition|technical condition|functional condition/.test(head)) {
    return 'technical';
  }
  if (/accessories|original box|original charger|valid bill|gst bill|bill available|do you have the following/.test(head)) {
    return 'accessories';
  }
  if (/esim|e-sim|sim support|physical sim/.test(head)) return 'esim';
  if (/switch on|turns on|power on|device switch/.test(head)) return 'power';

  // Fallback on slightly wider slice (still avoid sidebar issue labels)
  if (/make and receive calls|able to make calls/.test(q)) return 'calls';
  if (/age of your (mobile|phone|device)|above 11 month/.test(q)) return 'age';
  if (/under warranty|valid warranty/.test(q)) return 'warranty';
  if (/touch screen|touchscreen/.test(q) && /working|functionality/.test(q)) return 'touchscreen';
  if (/original screen|screen replaced/.test(q)) return 'screenOriginal';
  if (/physical condition|external damage|glass crack|back panel damage|screen\/body defects/.test(q)) return 'physical';
  if (/technical condition|functional condition|technical issue|functional issue|functional or physical problems/.test(q)) return 'technical';
  if (/screen physical condition|screen cracked/.test(q)) return 'screenPhysicalDetail';
  if (/accessories|do you have the following/.test(q)) return 'accessories';
  if (/esim|e-sim/.test(q)) return 'esim';
  return 'unknown';
}
