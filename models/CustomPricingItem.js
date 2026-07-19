import mongoose from 'mongoose';

const customPricingItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    defaultLabel: { type: String, default: '' },
    priceAdjustment: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CustomPricingItem = mongoose.model('CustomPricingItem', customPricingItemSchema);
export default CustomPricingItem;

/** Device Report checklist seed (all prices start at 0) */
export const CUSTOM_PRICING_SEED = [
  // Screen Condition
  { key: 'screen_touch_calibration', category: 'Screen Condition', label: 'Screen Touch Calibration', sortOrder: 10 },
  { key: 'screen_display_spot', category: 'Screen Condition', label: 'Screen Display Spot', sortOrder: 20 },
  { key: 'screen_display_lines', category: 'Screen Condition', label: 'Screen Display Lines', sortOrder: 30 },
  { key: 'screen_physical_condition', category: 'Screen Condition', label: 'Screen Physical Condition', sortOrder: 40 },
  { key: 'screen_discoloration', category: 'Screen Condition', label: 'Screen Discoloration', sortOrder: 50 },
  { key: 'screen_bubble_or_paint', category: 'Screen Condition', label: 'Screen Bubble or Paint', sortOrder: 60 },
  { key: 'sub_screen', category: 'Screen Condition', label: 'Sub Screen', sortOrder: 70 },
  // Functional
  { key: 'front_camera', category: 'Functional Condition', label: 'Front Camera', sortOrder: 100 },
  { key: 'back_camera', category: 'Functional Condition', label: 'Back Camera', sortOrder: 110 },
  { key: 'audio_jack', category: 'Functional Condition', label: 'Audio Jack', sortOrder: 120 },
  { key: 'wifi', category: 'Functional Condition', label: 'Wifi', sortOrder: 130 },
  { key: 'bluetooth', category: 'Functional Condition', label: 'Bluetooth', sortOrder: 140 },
  { key: 'volume_button', category: 'Functional Condition', label: 'Volume Button', sortOrder: 150 },
  { key: 'vibrator', category: 'Functional Condition', label: 'Vibrator', sortOrder: 160 },
  { key: 'battery', category: 'Functional Condition', label: 'Battery', sortOrder: 170 },
  { key: 'speaker', category: 'Functional Condition', label: 'Speaker', sortOrder: 180 },
  { key: 'microphone', category: 'Functional Condition', label: 'Microphone', sortOrder: 190 },
  { key: 'finger_touch_sensor', category: 'Functional Condition', label: 'Finger Touch Sensor', sortOrder: 200 },
  { key: 'proximity_sensor', category: 'Functional Condition', label: 'Proximity Sensor', sortOrder: 210 },
  { key: 'sim_tray', category: 'Functional Condition', label: 'SIM Tray', sortOrder: 220 },
  { key: 'charging_port', category: 'Functional Condition', label: 'Charging Port', sortOrder: 230 },
  { key: 'power_button', category: 'Functional Condition', label: 'Power Button', sortOrder: 240 },
  { key: 'face_sensor', category: 'Functional Condition', label: 'Face Sensor', sortOrder: 250 },
  { key: 'fc_image_blurred', category: 'Functional Condition', label: 'FC Image Blurred?', sortOrder: 260 },
  { key: 'bc_image_blurred', category: 'Functional Condition', label: 'BC Image Blurred?', sortOrder: 270 },
  { key: 'copy_screen', category: 'Functional Condition', label: 'Copy Screen', sortOrder: 280 },
  { key: 'ring_silent_key', category: 'Functional Condition', label: 'Ring Silent Key', sortOrder: 290 },
  { key: 'audio_ic', category: 'Functional Condition', label: 'Audio IC', sortOrder: 300 },
  { key: 'camera_glass_broken', category: 'Functional Condition', label: 'Camera Glass Broken', sortOrder: 310 },
  { key: 'sim_one', category: 'Functional Condition', label: 'Sim One', sortOrder: 320 },
  { key: 'sim_two', category: 'Functional Condition', label: 'Sim Two', sortOrder: 330 },
  // Purchase / accessories
  { key: 'purchased_in_india', category: 'Purchase & Accessories', label: 'Purchased in India', sortOrder: 400 },
  { key: 'multiple_esim', category: 'Purchase & Accessories', label: 'Multiple eSIM / Single eSIM', sortOrder: 410 },
  { key: 'charger', category: 'Purchase & Accessories', label: 'Charger', sortOrder: 420 },
  { key: 'box', category: 'Purchase & Accessories', label: 'Box', sortOrder: 430 },
  { key: 'mobile_age', category: 'Purchase & Accessories', label: 'Mobile Age', sortOrder: 440 },
  { key: 'mobile_warranty', category: 'Purchase & Accessories', label: 'Mobile Warranty', sortOrder: 450 },
  // Overall / locks
  { key: 'physical_scratch', category: 'Phone Overall Condition', label: 'Physical Condition (Scratch)', sortOrder: 500 },
  { key: 'physical_dent', category: 'Phone Overall Condition', label: 'Physical Condition (Dent)', sortOrder: 510 },
  { key: 'physical_panel', category: 'Phone Overall Condition', label: 'Physical Condition (Panel)', sortOrder: 520 },
  { key: 'physical_bent', category: 'Phone Overall Condition', label: 'Physical Condition (Bent)', sortOrder: 530 },
  { key: 'hinges_condition', category: 'Phone Overall Condition', label: 'Hinges Condition', sortOrder: 540 },
  { key: 'icloud_id_lock', category: 'Phone Overall Condition', label: 'Icloud/Id lock (For Iphone)', sortOrder: 550 },
  { key: 'country_lock', category: 'Phone Overall Condition', label: 'Country Lock', sortOrder: 560 },
];
