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
    enum: ['user_quiz', 'user_valuation', 'order', 'backfill'],
    default: 'user_quiz',
  },
  sourceId: { type: String, default: '' },
  /** Where the quiz/valuation was started from. */
  clientPlatform: {
    type: String,
    enum: ['App', 'Website'],
    default: 'Website',
    index: true,
  },
  /** Catalog variant base ("get upto") — used to prioritize the valuation queue. */
  basePrice: { type: Number, default: 0, index: true },
  internalPrice: { type: Number, default: null },
  cashifyPrice: { type: Number, default: null },
  ourOffer: { type: Number, default: null },
  difference: { type: Number, default: null },
  /** How many times this job was re-queued because the agent was busy. */
  requeueCount: { type: Number, default: 0 },
  agentStatus: {
    type: String,
    enum: ['pending', 'running', 'completed', 'partial', 'failed', 'skipped', 'overridden'],
    default: 'pending',
    index: true,
  },
  /** When status is overridden, points to the canonical completed record for this quiz hash */
  overriddenFromRecordId: { type: String, default: '' },
  cashifyProductUrl: { type: String, default: '' },
  error: { type: String, default: null },
  note: { type: String, default: null },
  durationMs: { type: Number, default: 0 },
  capturedAt: { type: Date, default: Date.now },
  runAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  hasFilledQuiz: { type: Boolean, default: false, index: true },
}, {
  timestamps: true,
});

pricingQuizRecordSchema.index(
  { slug: 1, quizHash: 1 },
  { unique: true, partialFilterExpression: { sourceType: { $ne: 'order' } } },
);
pricingQuizRecordSchema.index(
  { sourceType: 1, sourceId: 1 },
  { unique: true, partialFilterExpression: { sourceType: 'order', sourceId: { $ne: '' } } },
);
pricingQuizRecordSchema.index({ agentStatus: 1, capturedAt: -1 });
pricingQuizRecordSchema.index({ agentStatus: 1, basePrice: -1, createdAt: 1 });
pricingQuizRecordSchema.index({ capturedAt: -1 });
pricingQuizRecordSchema.index({ createdAt: -1 });

const PricingQuizRecord = mongoose.model('PricingQuizRecord', pricingQuizRecordSchema);
export default PricingQuizRecord;
