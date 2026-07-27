import Vendor from '../models/Vendor.js';
import VendorLedgerEntry from '../models/VendorLedgerEntry.js';

/**
 * Idempotently credit a vendor for a completed Razorpay top-up.
 * Looks up Pending ledger by razorpay order id (`paymentId`), then marks Completed.
 */
export const creditVendorTopup = async ({
  razorpayOrderId,
  razorpayPaymentId,
  amountPaise,
}) => {
  if (!razorpayOrderId) {
    return { ok: false, message: 'Missing order id' };
  }

  const entry = await VendorLedgerEntry.findOne({ paymentId: razorpayOrderId });
  if (!entry) {
    return { ok: false, message: 'Top-up order not found' };
  }

  if (entry.status === 'Completed') {
    const vendor = await Vendor.findById(entry.vendorId).select('credits walletBalance');
    return {
      ok: true,
      alreadyCredited: true,
      entry,
      credits: vendor?.credits || 0,
      walletBalance: vendor?.walletBalance || 0,
      creditsAdded: entry.credits || 0,
    };
  }

  const expectedPaise = Math.round(Number(entry.amount || 0) * 100);
  if (amountPaise != null && Number(amountPaise) !== expectedPaise) {
    return { ok: false, message: 'Amount mismatch' };
  }

  const credits = Number(entry.credits || 0);
  const amount = Number(entry.amount || 0);

  const vendor = await Vendor.findById(entry.vendorId);
  if (!vendor) {
    return { ok: false, message: 'Vendor not found' };
  }

  vendor.credits = Number(vendor.credits || 0) + credits;
  vendor.walletBalance = Number(vendor.walletBalance || 0) + amount;
  await vendor.save();

  entry.status = 'Completed';
  entry.paymentMode = 'RAZORPAY';
  entry.meta = {
    ...(entry.meta && typeof entry.meta === 'object' ? entry.meta : {}),
    razorpayPaymentId: razorpayPaymentId || entry.meta?.razorpayPaymentId || '',
    creditedAt: new Date().toISOString(),
  };
  await entry.save();

  return {
    ok: true,
    alreadyCredited: false,
    entry,
    credits: vendor.credits,
    walletBalance: vendor.walletBalance,
    creditsAdded: credits,
  };
};
