import mongoose from 'mongoose';

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
    /** Global on/off — off shows Coming Soon for everyone */
    enabled: { type: Boolean, default: true },
    /**
     * If true: users who already added an address can only see this page
     * when their pincode is serviceable. Guests / no-address users can still browse.
     */
    restrictByPincode: { type: Boolean, default: false },
  },
  { _id: false },
);

const appSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'default' },
    pages: { type: [pageSchema], default: [] },
    /** Flows that always require a serviceable pickup/shipping address */
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

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);
export default AppSettings;
