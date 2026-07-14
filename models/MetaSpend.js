import mongoose from 'mongoose';

/** Meta ad spend stored per selected date range (YYYY-MM-DD). */
const metaSpendSchema = new mongoose.Schema(
  {
    fromDate: {
      type: String,
      required: true,
      trim: true,
    },
    toDate: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

metaSpendSchema.index({ fromDate: 1, toDate: 1 }, { unique: true });

const MetaSpend = mongoose.model('MetaSpend', metaSpendSchema);
export default MetaSpend;
