/**
 * Discover or validate Cashify laptop product URLs for catalog devices.
 *
 * Usage:
 *   node scripts/discover-cashify-laptop-urls.js                 # laptops missing cashifyProductUrl
 *   node scripts/discover-cashify-laptop-urls.js --slug hp-probook-series
 *   node scripts/discover-cashify-laptop-urls.js --write         # save resolved URLs to MongoDB
 *   node scripts/discover-cashify-laptop-urls.js --validate-only # HTTP check without Playwright
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { chromium } from 'playwright';
import Device from '../models/Device.js';
import { buildCashifyProductUrlCandidates } from '../config/cashify.js';
import { pageLooksLikeProductListing } from '../services/cashify/flowHelpers.js';

dotenv.config();

const args = new Set(process.argv.slice(2));
const slugArg = process.argv.find((arg, idx) => process.argv[idx - 1] === '--slug');
const writeBack = args.has('--write');
const validateOnly = args.has('--validate-only');

async function validateWithFetch(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return false;
    const html = await res.text();
    return /get exact value|get upto|choose a variant/i.test(html)
      && !/page not found|404|something went wrong|no longer available/i.test(html);
  } catch {
    return false;
  }
}

async function validateWithPlaywright(page, urls, device) {
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(1500);
      if (await pageLooksLikeProductListing(page)) {
        return { url, productUrlsTried: urls.map((candidate) => ({ url: candidate, valid: candidate === url })) };
      }
    } catch {
      // try next
    }
  }

  const listingSlug = device.brand?.toLowerCase() === 'hp' ? 'sell-hp-compaq'
    : device.brand?.toLowerCase() === 'mi' ? 'sell-xiaomi'
      : `sell-${String(device.brand || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const listingUrl = `https://www.cashify.in/sell-old-laptop/${listingSlug}`;
  try {
    await page.goto(listingUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href*="/sell-old-laptop/used-"]')].map((el) => el.href));
    const hints = buildCashifyProductUrlCandidates(device).map((href) => href.split('/').pop());
    const ranked = [...new Set(links)]
      .map((href) => {
        const slug = href.split('/').pop() || '';
        const score = hints.some((hint) => slug === hint || slug.includes(hint) || hint.includes(slug)) ? 1 : 0;
        return { href, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const { href } of ranked.slice(0, 5)) {
      await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(1500);
      if (await pageLooksLikeProductListing(page)) {
        return {
          url: href,
          productUrlsTried: urls.map((candidate) => ({ url: candidate, valid: false })).concat([{ url: href, valid: true, reason: 'brand listing' }]),
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

async function resolveDeviceUrl(device, page) {
  const candidates = buildCashifyProductUrlCandidates(device);
  if (!candidates.length) {
    return { status: 'missing-slug', candidates: [] };
  }

  if (validateOnly) {
    for (const url of candidates) {
      if (await validateWithFetch(url)) {
        return { status: 'ok', url, candidates };
      }
    }
    return { status: 'not-found', candidates };
  }

  const resolved = await validateWithPlaywright(page, candidates, device);
  if (resolved?.url) {
    return { status: 'ok', url: resolved.url, candidates, productUrlsTried: resolved.productUrlsTried };
  }
  return { status: 'not-found', candidates };
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const filter = {
    category: { $in: ['laptop', 'mac'] },
    isActive: true,
  };
  if (slugArg) filter.slug = slugArg;
  else if (!args.has('--all')) filter.$or = [{ cashifyProductUrl: '' }, { cashifyProductUrl: { $exists: false } }];

  const devices = await Device.find(filter)
    .select('slug brand modelName category cashifyProductUrl')
    .sort({ brand: 1, modelName: 1 })
    .lean();

  console.log(`Checking ${devices.length} laptop(s)...`);

  const browser = validateOnly ? null : await chromium.launch({ headless: true });
  const page = browser ? await browser.newPage() : null;
  const summary = { ok: 0, notFound: 0, missing: 0 };

  for (const device of devices) {
    const result = await resolveDeviceUrl(device, page);
    if (result.status === 'ok') {
      summary.ok += 1;
      console.log(`OK   ${device.slug} -> ${result.url}`);
      if (writeBack) {
        await Device.updateOne({ _id: device._id }, { $set: { cashifyProductUrl: result.url } });
      }
    } else if (result.status === 'missing-slug') {
      summary.missing += 1;
      console.log(`SKIP ${device.slug} (no slug)`);
    } else {
      summary.notFound += 1;
      console.log(`FAIL ${device.slug}`);
      console.log(`     tried: ${result.candidates.join(', ')}`);
    }
  }

  if (browser) await browser.close();
  await mongoose.disconnect();

  console.log('\nSummary:', summary);
  if (writeBack) console.log('Wrote resolved cashifyProductUrl values to MongoDB.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
