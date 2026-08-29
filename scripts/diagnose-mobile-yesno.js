/**
 * One-off diagnostic: open mobile calculator and dump Yes/No option structure.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { startCalculator, openProductPage, saveDebug } from '../services/cashify/flowHelpers.js';
import { pickMobileVariant } from '../services/cashify/mobileFlow.js';
import config from '../config/cashify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
  || path.resolve(__dirname, '../../../DeviceKart-AI/session');
process.env.CASHIFY_HEADLESS = process.env.CASHIFY_HEADLESS || 'true';

const URLS = [
  'https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-m31',
];

async function main() {
  console.log('meta', readMeta().status);
  const { context, page } = await openSessionPage();
  try {
    await openProductPage(page, URLS, 'mobile');
    await page.waitForTimeout(1000);
    const picked = await pickMobileVariant(page, 'Galaxy M31', '6 GB/64 GB');
    console.log('variant picked:', picked);
    await page.waitForTimeout(800);

    try {
      await startCalculator(page);
    } catch (err) {
      console.log('startCalculator failed:', err.message);
      await saveDebug(page, 'diagnose-start-fail', config.SCREENSHOT_DIR);
      throw err;
    }
    await page.waitForTimeout(2500);
    console.log('url after calc:', page.url());

    const dump = await page.evaluate(() => {
      const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
      const continueBtn = [...document.querySelectorAll('button')].find((b) => /^continue$/i.test(normalize(b.innerText)));

      const leafYesNo = [...document.querySelectorAll('*')].filter((n) => {
        const t = normalize(n.innerText);
        if (t !== 'Yes' && t !== 'No') return false;
        if (!(n.offsetParent || n.getClientRects().length)) return false;
        const childHas = [...n.children].some((c) => {
          const ct = normalize(c.innerText);
          return ct === 'Yes' || ct === 'No';
        });
        return !childHas;
      }).map((n, i) => {
        const rect = n.getBoundingClientRect();
        return {
          i,
          tag: n.tagName,
          text: normalize(n.innerText),
          role: n.getAttribute('role'),
          className: String(n.className || '').slice(0, 120),
          y: Math.round(rect.top),
          x: Math.round(rect.left),
          beforeContinue: continueBtn ? Boolean(n.compareDocumentPosition(continueBtn) & Node.DOCUMENT_POSITION_FOLLOWING) : null,
        };
      });

      return {
        url: location.href,
        leafYesNo,
        bodySnippet: document.body.innerText.slice(0, 1000),
      };
    });

    console.log(JSON.stringify(dump, null, 2));

    // Try answering all three with Playwright nth
    const yesButtons = page.getByText('Yes', { exact: true });
    const noButtons = page.getByText('No', { exact: true });
    console.log('Yes count', await yesButtons.count(), 'No count', await noButtons.count());
    await yesButtons.nth(0).click({ force: true });
    await page.waitForTimeout(300);
    await yesButtons.nth(1).click({ force: true });
    await page.waitForTimeout(300);
    await noButtons.nth(2).click({ force: true });
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /continue/i }).first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1500);
    console.log('url after answers:', page.url());
    console.log('body after:', (await page.locator('body').innerText()).slice(0, 700));
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
