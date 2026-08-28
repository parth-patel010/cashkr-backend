import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import config from '../../config/cashify.js';

export const STATUS = {
  DISCONNECTED: 'disconnected',
  AUTH_REQUIRED: 'authentication_required',
  OTP_SENT: 'otp_sent',
  CONNECTED: 'connected',
  ERROR: 'error',
};

let loginHandle = null;
let sessionBusy = false;

function ensureSessionDirs() {
  fs.mkdirSync(config.SESSION_DIR, { recursive: true });
  fs.mkdirSync(config.USER_DATA_DIR, { recursive: true });
}

function readMeta() {
  ensureSessionDirs();
  try {
    return JSON.parse(fs.readFileSync(config.META_PATH, 'utf8'));
  } catch {
    return {
      status: STATUS.DISCONNECTED,
      phoneMasked: null,
      connectedAt: null,
      lastVerifiedAt: null,
      lastError: null,
    };
  }
}

function writeMeta(patch) {
  ensureSessionDirs();
  const next = { ...readMeta(), ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(config.META_PATH, JSON.stringify(next, null, 2));
  return next;
}

export function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  if (digits.length !== 10) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }
  return digits;
}

function normalizeOtp(otp) {
  const digits = String(otp || '').replace(/\D/g, '');
  if (digits.length < 4 || digits.length > 8) {
    throw new Error('Enter a valid OTP.');
  }
  return digits;
}

async function withBusy(fn) {
  if (sessionBusy) {
    throw new Error('Cashify session is busy. Try again in a moment.');
  }
  sessionBusy = true;
  try {
    return await fn();
  } finally {
    sessionBusy = false;
  }
}

async function launchPersistent(options = {}) {
  ensureSessionDirs();
  const context = await chromium.launchPersistentContext(config.USER_DATA_DIR, {
    headless: config.HEADLESS,
    slowMo: config.SLOW_MO_MS,
    viewport: { width: 1366, height: 900 },
    locale: 'en-IN',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    args: ['--disable-blink-features=AutomationControlled'],
    ...options,
  });
  context.setDefaultTimeout(config.NAV_TIMEOUT_MS);
  return context;
}

async function closeLoginHandle() {
  if (!loginHandle) return;
  try {
    await loginHandle.context.close();
  } catch {
    // ignore
  }
  loginHandle = null;
}

async function pageText(page) {
  return page.locator('body').innerText().catch(() => '');
}

function looksLoggedIn(text) {
  const t = String(text || '').toLowerCase();
  if (/logout|my account|my orders|profile|hi,|welcome/.test(t) && !/login\/signup/.test(t)) {
    return true;
  }
  if (/\baccount\b/.test(t) && !/\blogin\b/.test(t)) return true;
  return false;
}

function hasLoginButton(text) {
  return /\blogin\b/i.test(String(text || ''));
}

async function saveDebugScreenshot(page, label) {
  try {
    fs.mkdirSync(config.SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(config.SCREENSHOT_DIR, `${Date.now()}-${label}.png`),
      fullPage: true,
    });
  } catch {
    // ignore
  }
}

async function openLoginModal(page) {
  const loginBtn = page.getByRole('button', { name: /^login$/i });
  if (await loginBtn.count()) {
    await loginBtn.first().click({ force: true, timeout: 5000 });
  } else {
    await page.getByText('Login', { exact: true }).first().click({ force: true, timeout: 5000 });
  }
  await page.locator('#mobile-no').waitFor({ state: 'visible', timeout: 10000 });
}

function otpInputLocator(page) {
  return page.locator('input[type="tel"][maxlength="6"]:not(#store-pincode-search):not(#mobile-no)');
}

async function fillPhoneAndRequestOtp(page, phone) {
  const mobile = page.locator('#mobile-no');
  await mobile.waitFor({ state: 'visible', timeout: 10000 });
  await mobile.click({ force: true });
  await mobile.fill(phone);

  const terms = page.locator('label').filter({ hasText: /terms|privacy|agree/i }).locator('input[type="checkbox"]');
  if (await terms.count()) {
    const checkbox = terms.first();
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true }).catch(() => {});
    }
  }

  const continueBtn = page.getByRole('button', { name: /^continue$/i });
  if (await continueBtn.count()) {
    await continueBtn.last().click({ force: true, timeout: 5000 });
  } else {
    await page.getByText('CONTINUE', { exact: false }).first().click({ force: true });
  }

  await otpInputLocator(page).waitFor({ state: 'visible', timeout: 20000 });
}

async function submitOtp(page, otp) {
  const otpInput = otpInputLocator(page).last();
  await otpInput.waitFor({ state: 'visible', timeout: 10000 });
  await otpInput.click({ force: true });
  await otpInput.fill(otp);

  const verifyBtn = page.getByRole('button', { name: /verify|continue|submit|login/i });
  if (await verifyBtn.count()) {
    await verifyBtn.last().click({ force: true }).catch(() => {});
  }
  await page.waitForTimeout(2500);
}

async function clickCashifyLogout(page) {
  const logout = page.getByText(/logout|log out|sign out/i);
  if (await logout.count()) {
    await logout.first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
    return true;
  }
  const account = page.getByText(/account|profile|hi,/i).first();
  if (await account.count()) {
    await account.click({ force: true }).catch(() => {});
    await page.waitForTimeout(600);
    if (await logout.count()) {
      await logout.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
      return true;
    }
  }
  return false;
}

function clearProfileDir() {
  ensureSessionDirs();
  try {
    fs.rmSync(config.USER_DATA_DIR, { recursive: true, force: true });
  } catch {
    // ignore
  }
  fs.mkdirSync(config.USER_DATA_DIR, { recursive: true });
}

export async function getStatus() {
  const meta = readMeta();
  return {
    status: meta.status || STATUS.DISCONNECTED,
    phoneMasked: meta.phoneMasked || null,
    connectedAt: meta.connectedAt || null,
    lastVerifiedAt: meta.lastVerifiedAt || null,
    lastError: meta.lastError || null,
    otpPending: Boolean(loginHandle),
    connected: meta.status === STATUS.CONNECTED,
  };
}

export async function verifySessionAlive() {
  const meta = readMeta();
  if (meta.status !== STATUS.CONNECTED) {
    return getStatus();
  }

  return withBusy(async () => {
    const context = await launchPersistent();
    try {
      const page = context.pages()[0] || await context.newPage();
      await page.goto('https://www.cashify.in/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const text = await pageText(page);
      if (looksLoggedIn(text) || !hasLoginButton(text)) {
        writeMeta({
          status: STATUS.CONNECTED,
          lastVerifiedAt: new Date().toISOString(),
          lastError: null,
        });
      } else {
        writeMeta({
          status: STATUS.AUTH_REQUIRED,
          lastError: 'Session expired. Please connect again.',
          connectedAt: null,
        });
      }
    } catch (error) {
      writeMeta({ status: STATUS.ERROR, lastError: error.message });
    } finally {
      await context.close().catch(() => {});
    }
    return getStatus();
  });
}

export async function requestOtp(phoneRaw) {
  const phone = normalizePhone(phoneRaw);
  return withBusy(async () => {
    await closeLoginHandle();
    writeMeta({
      status: STATUS.AUTH_REQUIRED,
      phoneMasked: maskPhone(phone),
      lastError: null,
    });

    const context = await launchPersistent();
    const page = context.pages()[0] || await context.newPage();
    try {
      await page.goto('https://www.cashify.in/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await openLoginModal(page);
      await fillPhoneAndRequestOtp(page, phone);

      loginHandle = { context, page, phone };
      writeMeta({
        status: STATUS.OTP_SENT,
        phoneMasked: maskPhone(phone),
        lastError: null,
      });
      return {
        ok: true,
        status: STATUS.OTP_SENT,
        phoneMasked: maskPhone(phone),
        message: 'OTP requested on Cashify. Enter the OTP you received.',
      };
    } catch (error) {
      await saveDebugScreenshot(page, 'otp-request-failed');
      await context.close().catch(() => {});
      loginHandle = null;
      writeMeta({ status: STATUS.ERROR, lastError: error.message });
      throw error;
    }
  });
}

export async function verifyOtp(otpRaw) {
  const otp = normalizeOtp(otpRaw);
  if (!loginHandle) {
    throw new Error('No OTP request in progress. Enter phone number first.');
  }

  return withBusy(async () => {
    const { context, page, phone } = loginHandle;
    try {
      await submitOtp(page, otp);
      await page.goto('https://www.cashify.in/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const text = await pageText(page);
      const connected = looksLoggedIn(text) || !hasLoginButton(text);
      if (!connected) {
        writeMeta({
          status: STATUS.OTP_SENT,
          lastError: 'OTP may be incorrect. Try again.',
        });
        throw new Error('OTP verification failed. Check the code and try again.');
      }

      writeMeta({
        status: STATUS.CONNECTED,
        phoneMasked: maskPhone(phone),
        connectedAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        lastError: null,
      });

      await context.close().catch(() => {});
      loginHandle = null;

      return {
        ok: true,
        status: STATUS.CONNECTED,
        phoneMasked: maskPhone(phone),
        message: 'Cashify connected. Session will be reused for valuations.',
      };
    } catch (error) {
      if (!loginHandle?.context) {
        writeMeta({ status: STATUS.ERROR, lastError: error.message });
      }
      throw error;
    }
  });
}

export async function logoutCashify() {
  return withBusy(async () => {
    await closeLoginHandle();
    let loggedOutOnSite = false;
    try {
      const context = await launchPersistent();
      try {
        const page = context.pages()[0] || await context.newPage();
        await page.goto('https://www.cashify.in/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        loggedOutOnSite = await clickCashifyLogout(page);
        await context.clearCookies().catch(() => {});
      } finally {
        await context.close().catch(() => {});
      }
    } catch {
      // still wipe local profile
    }

    clearProfileDir();
    writeMeta({
      status: STATUS.DISCONNECTED,
      phoneMasked: null,
      connectedAt: null,
      lastVerifiedAt: null,
      lastError: null,
    });

    return {
      ok: true,
      status: STATUS.DISCONNECTED,
      loggedOutOnSite,
      message: loggedOutOnSite
        ? 'Logged out from Cashify and cleared local session.'
        : 'Local session cleared. Cashify site logout may need manual confirm next visit.',
    };
  });
}

export async function openSessionPage(url) {
  ensureSessionDirs();
  if (loginHandle) {
    throw new Error('Finish or cancel the OTP login before starting a valuation.');
  }
  if (sessionBusy) {
    throw new Error('Cashify session is busy. Try again in a moment.');
  }
  sessionBusy = true;
  try {
    const context = await launchPersistent();
    const originalClose = context.close.bind(context);
    context.close = async (...args) => {
      try {
        return await originalClose(...args);
      } finally {
        sessionBusy = false;
      }
    };
    const page = context.pages()[0] || await context.newPage();
    if (url) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    }
    return { context, page };
  } catch (error) {
    sessionBusy = false;
    throw error;
  }
}

export { readMeta };
