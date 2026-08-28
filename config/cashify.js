import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sessionRoot = process.env.CASHIFY_SESSION_DIR
  || path.join(__dirname, '..', 'data', 'cashify-session');

export default {
  MARKUP_INR: Number(process.env.CASHIFY_MARKUP_INR) || 1000,
  HEADLESS: process.env.CASHIFY_HEADLESS !== 'false',
  SLOW_MO_MS: process.env.CASHIFY_HEADLESS === 'false' ? 80 : 0,
  NAV_TIMEOUT_MS: 45_000,
  STEP_TIMEOUT_MS: 8_000,
  MAX_QUESTION_STEPS: 24,
  SESSION_DIR: sessionRoot,
  USER_DATA_DIR: path.join(sessionRoot, 'browser-profile'),
  META_PATH: path.join(sessionRoot, 'meta.json'),
  SCREENSHOT_DIR: path.join(sessionRoot, 'screenshots'),
};

export function buildCashifyProductUrl(device) {
  if (device.cashifyProductUrl) return device.cashifyProductUrl;
  const slug = String(device.slug || '').trim();
  if (!slug) return '';
  if (device.category === 'mobile') {
    return `https://www.cashify.in/sell-old-mobile-phones/used-${slug}`;
  }
  if (device.category === 'laptop' || device.category === 'mac') {
    return `https://www.cashify.in/sell-old-laptop/used-${slug}`;
  }
  return '';
}
