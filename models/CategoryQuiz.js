import mongoose from 'mongoose';

const quizOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    emoji: { type: String, default: '' },
    deductionValue: { type: Number, default: 0 },
  },
  { _id: false },
);

const quizWindowSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '', trim: true },
    question: { type: String, default: '', trim: true },
    choiceType: { type: String, enum: ['single', 'multi'], default: 'single' },
    options: { type: [quizOptionSchema], default: [] },
  },
  { _id: false },
);

const modelDeductionSchema = new mongoose.Schema(
  {
    deviceSlug: { type: String, required: true, trim: true },
    optionId: { type: String, required: true },
    value: { type: Number, default: 0 },
  },
  { _id: false },
);

const categoryQuizSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    windows: { type: [quizWindowSchema], default: [] },
    deductionMode: {
      type: String,
      enum: ['universal', 'model-wise'],
      default: 'universal',
    },
    modelDeductions: { type: [modelDeductionSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CategoryQuiz = mongoose.model('CategoryQuiz', categoryQuizSchema);
export default CategoryQuiz;
