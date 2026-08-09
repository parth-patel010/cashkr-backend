import Device from '../models/Device.js';

/**
 * Credits required for a vendor to accept this sell order.
 * Prefer the device model's orderCreditCost; fall back to vendorDefaultCost
 * when the device is missing or model cost is unset/0 and a vendor default is provided.
 *
 * @param {{ device?: { slug?: string } }} order
 * @param {number} [vendorDefaultCost=0]
 * @returns {Promise<number>}
 */
export async function resolveOrderCreditCost(order, vendorDefaultCost = 0) {
  const slug = order?.device?.slug ? String(order.device.slug).trim() : '';
  let modelCost = 0;

  if (slug) {
    const device = await Device.findOne({ slug }).select('orderCreditCost').lean();
    if (device && device.orderCreditCost != null) {
      modelCost = Math.max(0, Number(device.orderCreditCost) || 0);
    }
  }

  if (modelCost > 0) return modelCost;
  return Math.max(0, Number(vendorDefaultCost) || 0);
}

/**
 * Map slug → orderCreditCost for a batch of orders.
 * @param {string[]} slugs
 * @returns {Promise<Record<string, number>>}
 */
export async function creditCostBySlugs(slugs) {
  const unique = [...new Set((slugs || []).filter(Boolean))];
  if (!unique.length) return {};
  const devices = await Device.find({ slug: { $in: unique } })
    .select('slug orderCreditCost')
    .lean();
  return Object.fromEntries(
    devices.map((d) => [d.slug, Math.max(0, Number(d.orderCreditCost) || 0)]),
  );
}
