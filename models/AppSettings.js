import mongoose from 'mongoose';
import { defaultWebsiteCategories } from '../config/websiteCategories.js';

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

const appSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'default' },
    pages: { type: [pageSchema], default: [] },
    categories: { type: [categorySchema], default: [] },
    requireAddressFor: {
      type: [String],
      default: ['sell', 'buy', 'repair'],
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

export { defaultWebsiteCategories };

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);
export default AppSettings;
