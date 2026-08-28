import mongoose from 'mongoose';

const agentTestRunSchema = new mongoose.Schema({
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  modelName: { type: String, default: '' },
  slug: { type: String, required: true, index: true },
  storage: { type: String, default: '' },
  variant: { type: mongoose.Schema.Types.Mixed, default: null },
  quizPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  internalResult: { type: mongoose.Schema.Types.Mixed, default: null },
  cashifyResult: { type: mongoose.Schema.Types.Mixed, default: null },
  comparison: { type: mongoose.Schema.Types.Mixed, default: null },
  status: {
    type: String,
    enum: ['completed', 'partial', 'failed'],
    default: 'completed',
  },
  error: { type: String, default: null },
  debugArtifacts: { type: mongoose.Schema.Types.Mixed, default: null },
  runBy: { type: String, default: '' },
  durationMs: { type: Number, default: 0 },
}, {
  timestamps: true,
});

agentTestRunSchema.index({ createdAt: -1 });

const AgentTestRun = mongoose.model('AgentTestRun', agentTestRunSchema);
export default AgentTestRun;
