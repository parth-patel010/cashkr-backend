import mongoose from 'mongoose';

const pricingQuizRecordSchema = new mongoose.Schema({
  slug: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, default: '' },
  modelName: { type: String, default: '' },
  storage: { type: String, default: '' },
  quizPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  quizSummary: { type: [mongoose.Schema.Types.Mixed], default: [] },
  quizHash: { type: String, required: true, index: true },
  sourceType: {
    type: String,
    enum: ['user_quiz', 'order', 'backfill'],
    default: 'user_quiz',
  },
  sourceId: { type: String, default: '' },
  internalPrice: { type: Number, default: null },
  cashifyPrice: { type: Number, default: null },
  ourOffer: { type: Number, default: null },
  difference: { type: Number, default: null },
  agentStatus: {
    type: String,
    enum: ['pending', 'running', 'completed', 'partial', 'failed', 'skipped'],
    default: 'pending',
    index: true,
  },
  cashifyProductUrl: { type: String, default: '' },
  error: { type: String, default: null },
  note: { type: String, default: null },
  durationMs: { type: Number, default: 0 },
  capturedAt: { type: Date, default: Date.now },
  runAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
}, {
  timestamps: true,
});

pricingQuizRecordSchema.index({ slug: 1, quizHash: 1 }, { unique: true });
pricingQuizRecordSchema.index({ agentStatus: 1, createdAt: -1 });
pricingQuizRecordSchema.index({ createdAt: -1 });

const PricingQuizRecord = mongoose.model('PricingQuizRecord', pricingQuizRecordSchema);
export default PricingQuizRecord;
