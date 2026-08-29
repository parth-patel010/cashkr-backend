/**
 * Dump mobile pages when skipping physical defects (Continue only).
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { startCalculator, openProductPage, clickContinue, clickLabel } from '../services/cashify/flowHelpers.js';
import { pickMobileVariant } from '../services/cashify/mobileFlow.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
  || path.resolve(__dirname, '../../../DeviceKart-AI/session');
process.env.CASHIFY_HEADLESS = process.env.CASHIFY_HEADLESS || 'true';

async function dumpPage(page, label) {
  const text = await page.locator('body').innerText();
  console.log(`\n===== ${label} | pageId=${new URL(page.url()).searchParams.get('pageId')} =====`);
  const more = text.indexOf('\nMore\n');
  const slice = more >= 0 ? text.slice(more + 6, more + 900) : text.slice(0, 900);
  console.log(slice);
}

async function answerYesTrio(page) {
  for (let i = 0; i < 3; i += 1) {
    await page.getByText('Yes', { exact: true }).nth(i).click({ force: true });
    await page.waitForTimeout(200);
  }
  await clickContinue(page);
  await page.waitForTimeout(1000);
}

async function main() {
  console.log('meta', readMeta().status);
  const { context, page } = await openSessionPage();
  try {
    await openProductPage(page, ['https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-m31'], 'mobile');
    await pickMobileVariant(page, 'Galaxy M31', '6 GB/64 GB');
    await startCalculator(page);
    await page.waitForTimeout(1200);
    await answerYesTrio(page);
    await dumpPage(page, 'physical');

    // Skip physical defects
    await clickContinue(page);
    await page.waitForTimeout(1200);
    await dumpPage(page, 'after-skip-physical');

    // Keep clicking through answering age / issues with defaults
    for (let step = 0; step < 12; step += 1) {
      const text = await page.locator('body').innerText();
      if (/selling price|sell\/quote/i.test(text) || /sell\/quote/.test(page.url())) {
        await dumpPage(page, 'QUOTE');
        break;
      }
      if (/age of your|0 - 3 month|above 11 month/i.test(text)) {
        await clickLabel(page, 'Above 11 Months');
      } else if (/under warranty|valid warranty/i.test(text)) {
        await page.getByText('No', { exact: true }).first().click({ force: true });
      } else if (/bill available|original box|original charger|do you have the following/i.test(text)) {
        await clickLabel(page, 'Bill Not Available').catch(() => {});
        await clickLabel(page, 'Box Not Available').catch(() => {});
        await clickLabel(page, 'Charger Not Available').catch(() => {});
      } else if (/screen cracked|1-2 scratches|more than 2 scratches/i.test(text)) {
        await clickLabel(page, '1-2 scratches on screen');
      } else if (/dead spot|discoloration/i.test(text) && /screen/i.test(text)) {
        // leave or pick first option
      }
      await clickContinue(page);
      await page.waitForTimeout(1000);
      await dumpPage(page, `step-${step}`);
    }
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
