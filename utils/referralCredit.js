import User from '../models/User.js';
import Order from '../models/Order.js';
import BuyOrder from '../models/BuyOrder.js';
import { ensureAppSettings } from '../controllers/appSettings.controller.js';
import { notifyUserPushTokens } from './pushNotifications.js';
import { createInboxNotifications } from './userInbox.js';

const DEFAULT_REFERRAL_BONUS = 100;

async function getReferralBonusAmount() {
  try {
    const settings = await ensureAppSettings();
    const amount = Number(settings?.referralBonusAmount);
    return Number.isFinite(amount) && amount >= 0 ? amount : DEFAULT_REFERRAL_BONUS;
  } catch {
    return DEFAULT_REFERRAL_BONUS;
  }
}

/**
 * When a referred user completes an eligible sell or buy order, mark them credited
 * and notify the referrer. Credits once per referred user.
 */
export async function creditReferralOnEligibleCompletion(userId) {
  if (!userId) return;

  const user = await User.findById(userId).select('referredBy referralBonusCreditedAt name');
  if (!user?.referredBy || user.referralBonusCreditedAt) return;

  const [completedSell, completedBuy] = await Promise.all([
    Order.exists({ userId, status: 'completed' }),
    BuyOrder.exists({ userId, status: 'delivered' }),
  ]);

  if (!completedSell && !completedBuy) return;

  user.referralBonusCreditedAt = new Date();
  await user.save();

  const amount = await getReferralBonusAmount();
  const referrer = await User.findOne({ referralCode: user.referredBy }).select(
    'pushTokens name',
  );
  if (!referrer) return;

  try {
    const payload = {
      title: 'Referral reward unlocked',
      body: `You earned ₹${amount} — ${user.name || 'A friend'} completed their first order.`,
      data: { type: 'referral_bonus', amount: String(amount) },
    };
    await createInboxNotifications([referrer._id], payload);
    await notifyUserPushTokens(referrer, payload);
  } catch (err) {
    console.error('Referral push failed:', err.message);
  }
}
