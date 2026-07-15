/**
 * Seed RepairService catalog for popular phone brands (with priced issues).
 * Also ensures those brands have the Repair offer enabled.
 *
 * Usage: npm run seed:repair
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Brand from '../models/Brand.js';
import RepairService from '../models/RepairService.js';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ISSUES = [
  { key: 'screen', label: 'Screen Damage', price: 2499, description: 'Cracked, dead pixels, or touch issues', isActive: true },
  { key: 'battery', label: 'Battery Replacement', price: 1499, description: 'Low health, swelling, or fast drain', isActive: true },
  { key: 'camera', label: 'Camera Repair', price: 1999, description: 'Blurry lens, focus fail, or dead camera', isActive: true },
  { key: 'mic', label: 'Mic / Speaker', price: 999, description: 'No sound, muffled audio, or mic fail', isActive: true },
  { key: 'charging', label: 'Charging Port', price: 1299, description: 'Loose port or not charging', isActive: true },
  { key: 'soft_damage', label: 'Software Issues', price: 799, description: 'Boot loop, update fail, lag', isActive: true },
  { key: 'back_panel', label: 'Back Panel', price: 1799, description: 'Cracked or scratched rear glass', isActive: true },
  { key: 'other', label: 'Other', price: 499, description: 'Describe the issue while booking', isActive: true },
];

/** Brand-specific price multipliers (Apple screens cost more, etc.) */
const BRANDS = [
  { name: 'Apple', multiplier: 1.6 },
  { name: 'Samsung', multiplier: 1.2 },
  { name: 'OnePlus', multiplier: 1.1 },
  { name: 'Xiaomi', multiplier: 0.95 },
  { name: 'Realme', multiplier: 0.9 },
  { name: 'Vivo', multiplier: 0.95 },
  { name: 'Oppo', multiplier: 0.95 },
  { name: 'Google', multiplier: 1.25 },
  { name: 'Motorola', multiplier: 0.9 },
  { name: 'Nothing', multiplier: 1.05 },
];

async function run() {
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const brand of BRANDS) {
    const issues = ISSUES.map((issue) => ({
      ...issue,
      price: Math.round(issue.price * brand.multiplier),
    }));

    const slug = slugify(`${brand.name}-mobile-repair`);

    const existing = await RepairService.findOne({ slug });
    if (existing) {
      existing.brand = brand.name;
      existing.category = 'mobile';
      existing.title = `${brand.name} Repair`;
      existing.issues = issues;
      existing.description = 'Doorstep repair by trained technicians with quality check.';
      existing.turnaroundHours = 24;
      existing.warrantyDays = 90;
      existing.isActive = true;
      await existing.save();
      updated += 1;
    } else {
      await RepairService.create({
        brand: brand.name,
        category: 'mobile',
        title: `${brand.name} Repair`,
        slug,
        description: 'Doorstep repair by trained technicians with quality check.',
        issues,
        turnaroundHours: 24,
        warrantyDays: 90,
        isActive: true,
        sortOrder: 0,
      });
      created += 1;
    }

    // Ensure brand exists with repair offer
    const brandSlug = slugify(brand.name);
    await Brand.findOneAndUpdate(
      { slug: brandSlug },
      {
        $set: {
          name: brand.name,
          isActive: true,
        },
        $addToSet: {
          categories: 'mobile',
          offers: { $each: ['sell', 'buy', 'repair'] },
        },
        $setOnInsert: {
          slug: brandSlug,
          logoUrl: '',
          color: '#2F6BFF',
          sortOrder: 0,
        },
      },
      { upsert: true },
    );
  }

  console.log(`Repair seed done. Created: ${created}, Updated: ${updated}`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
