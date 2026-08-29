/**
 * Test screen + body physical detail clicks.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { startCalculator, openProductPage, clickContinue } from '../services/cashify/flowHelpers.js';
import { pickMobileVariant } from '../services/cashify/mobileFlow.js';
import { classifyMobileQuestion } from '../services/cashify/selectors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
  || path.resolve(__dirname, '../../../DeviceKart-AI/session');
process.env.CASHIFY_HEADLESS = process.env.CASHIFY_HEADLESS || 'true';

async function questionHead(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  const moreIdx = text.indexOf('\nMore\n');
  if (moreIdx < 0) return text.slice(0, 500);
  const afterMore = text.slice(moreIdx + 6);
  const stops = ['\nContinue\n', '\nDevice Evaluation\n', '\nFollow us on\n'];
  let end = afterMore.length;
  for (const stop of stops) {
    const idx = afterMore.indexOf(stop);
    if (idx >= 0 && idx < end) end = idx;
  }
  return afterMore.slice(0, end).trim();
}

async function main() {
  console.log('meta', readMeta().status);
  const { context, page } = await openSessionPage();
  try {
    await openProductPage(page, ['https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-m31'], 'mobile');
    await pickMobileVariant(page, 'Galaxy M31', '6 GB/64 GB');
    await startCalculator(page);
    await page.waitForTimeout(1000);

    for (let i = 0; i < 3; i += 1) {
      await page.getByText('Yes', { exact: true }).nth(i).click({ force: true });
    }
    await clickContinue(page);
    await page.waitForTimeout(1000);

    await page.getByText('Broken/scratch on device screen', { exact: true }).first().click({ force: true });
    await clickContinue(page);
    await page.waitForTimeout(1200);

    const head = await questionHead(page);
    console.log('HEAD:\n', head);
    console.log('KIND:', classifyMobileQuestion(head));

    const label = '1-2 scratches on screen';
    const loc = page.getByText(label, { exact: true });
    console.log('count', await loc.count());
    await loc.first().click({ force: true });
    await page.waitForTimeout(500);
    const moved = await clickContinue(page);
    console.log('continue moved', moved, page.url());
    await page.waitForTimeout(1200);
    console.log('after head kind', classifyMobileQuestion(await questionHead(page)));
    console.log((await page.locator('body').innerText()).slice(0, 600));
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
