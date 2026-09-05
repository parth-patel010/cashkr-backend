import mongoose from 'mongoose';
import { defaultWebsiteCategories } from '../config/websiteCategories.js';
import { defaultHomeBanners } from '../config/homeBanners.js';

export const APP_PAGE_DEFS = [
  { key: 'sell', label: 'Sell', group: 'tabs' },
  { key: 'buy', label: 'Buy', group: 'tabs' },
  { key: 'repair', label: 'Repair', group: 'tabs' },
  { key: 'services', label: 'Services', group: 'tabs' },
  { key: 'offers', label: 'Offers', group: 'profile' },
  { key: 'career', label: 'Career', group: 'profile' },
  { key: 'about', label: 'About Us', group: 'profile' },
  { key: 'contact', label: 'Contact Us', group: 'profile' },
  { key: 'earnings', label: 'Refer & Earn', group: 'profile' },
  { key: 'chat', label: 'Chat Support', group: 'profile' },
  { key: 'legal', label: 'Legal / FAQ', group: 'profile' },
  { key: 'cart', label: 'Cart', group: 'commerce' },
  { key: 'orders', label: 'My Orders', group: 'commerce' },
];

const pageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    restrictByPincode: { type: Boolean, default: false },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    sellPath: { type: String, default: '' },
    buyPath: { type: String, default: '' },
    enabledSell: { type: Boolean, default: true },
    enabledBuy: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const bannerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    ctaText: { type: String, default: 'Sell Now' },
    ctaLink: { type: String, default: '/sell-old-mobile-phones/brand' },
    imageUrl: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const appSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'default' },
    pages: { type: [pageSchema], default: [] },
    categories: { type: [categorySchema], default: [] },
    banners: { type: [bannerSchema], default: [] },
    sellBanners: { type: [bannerSchema], default: [] },
    repairBanners: { type: [bannerSchema], default: [] },
    referralBonusAmount: { type: Number, default: 100 },
    requireAddressFor: {
      type: [String],
      default: ['sell', 'buy', 'repair'],
    },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: {
      type: String,
      default: "Stay tuned — we're currently under maintenance. We'll be back shortly.",
    },
    maintenanceContact: { type: String, default: '' },
    androidMinVersion: { type: String, default: '' },
    androidDownloadUrl: {
      type: String,
      default: 'https://play.google.com/store/apps/details?id=com.devicekart.app',
    },
    iosMinVersion: { type: String, default: '' },
    iosDownloadUrl: { type: String, default: '' },
    pricingAgent: {
      mobileBrackets: {
        type: [{
          min: { type: Number, default: 0 },
          max: { type: Number, default: null },
          percent: { type: Number, default: 0 },
        }],
        default: undefined,
      },
      laptopBrackets: {
        type: [{
          min: { type: Number, default: 0 },
          max: { type: Number, default: null },
          percent: { type: Number, default: 0 },
        }],
        default: undefined,
      },
      fallbackFixedInr: { type: Number, default: 1000 },
    },
    vendorCommission: {
      defaultBrackets: {
        type: [{
          min: { type: Number, default: 0 },
          max: { type: Number, default: null },
          percent: { type: Number, default: 0 },
        }],
        default: undefined,
      },
    },
  },
  { timestamps: true },
);

export function defaultAppSettingsPages() {
  return APP_PAGE_DEFS.map((p) => ({
    key: p.key,
    label: p.label,
    enabled: true,
    restrictByPincode: ['sell', 'buy', 'repair'].includes(p.key),
  }));
}

export { defaultWebsiteCategories, defaultHomeBanners };

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);
export default AppSettings;
