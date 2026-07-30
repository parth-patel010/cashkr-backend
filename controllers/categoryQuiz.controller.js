import CategoryQuiz from '../models/CategoryQuiz.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { DEFAULT_SMARTWATCH_QUIZ, SMARTWATCH_QUIZ_CATEGORY } from '../config/smartwatchQuizDefaults.js';
import { DEFAULT_GAMING_QUIZ, GAMING_QUIZ_CATEGORY } from '../config/gamingQuizDefaults.js';
import { DEFAULT_EARBUDS_QUIZ, EARBUDS_QUIZ_CATEGORY } from '../config/earbudsQuizDefaults.js';

const newId = (prefix = 'id') =>
  `${prefix}-${crypto.randomBytes(4).toString('hex')}`;

const REQUIRED_SW_WINDOW_IDS = ['power', 'screen', 'physical', 'functional', 'accessories'];
const REQUIRED_GC_WINDOW_IDS = ['power', 'physical', 'functional', 'accessories', 'game_cds'];
const REQUIRED_EB_WINDOW_IDS = ['power', 'voice_mic', 'connectivity', 'physical', 'accessories', 'age'];

function hasRequiredWindows(quiz, requiredIds) {
  if (!quiz || !Array.isArray(quiz.windows) || quiz.windows.length < requiredIds.length) {
    return false;
  }
  const ids = new Set(quiz.windows.map((w) => w.id));
  return requiredIds.every((id) => ids.has(id));
}

/** Ensure default smartwatch quiz exists with full question set. */
export const ensureSmartwatchQuiz = async () => {
  const existing = await CategoryQuiz.findOne({ category: SMARTWATCH_QUIZ_CATEGORY });
  if (!existing) {
    return CategoryQuiz.create(DEFAULT_SMARTWATCH_QUIZ);
  }
  if (!hasRequiredWindows(existing, REQUIRED_SW_WINDOW_IDS)) {
    existing.windows = DEFAULT_SMARTWATCH_QUIZ.windows;
    existing.deductionMode = existing.deductionMode || 'universal';
    existing.isActive = true;
    await existing.save();
  }
  return existing;
};

/** Ensure default gaming console quiz exists with full question set. */
export const ensureGamingQuiz = async () => {
  const existing = await CategoryQuiz.findOne({ category: GAMING_QUIZ_CATEGORY });
  if (!existing) {
    return CategoryQuiz.create(DEFAULT_GAMING_QUIZ);
  }
  if (!hasRequiredWindows(existing, REQUIRED_GC_WINDOW_IDS)) {
    existing.windows = DEFAULT_GAMING_QUIZ.windows;
    existing.deductionMode = existing.deductionMode || 'universal';
    existing.isActive = true;
    await existing.save();
  }
  return existing;
};

/** Ensure default earbuds quiz exists with full question set. */
export const ensureEarbudsQuiz = async () => {
  const existing = await CategoryQuiz.findOne({ category: EARBUDS_QUIZ_CATEGORY });
  if (!existing) {
    return CategoryQuiz.create(DEFAULT_EARBUDS_QUIZ);
  }
  if (!hasRequiredWindows(existing, REQUIRED_EB_WINDOW_IDS)) {
    existing.windows = DEFAULT_EARBUDS_QUIZ.windows;
    existing.deductionMode = existing.deductionMode || 'universal';
    existing.isActive = true;
    await existing.save();
  }
  return existing;
};

const normalizeQuizPayload = (body = {}) => {
  const category = String(body.category || '')
    .trim()
    .toLowerCase();
  const deductionMode =
    body.deductionMode === 'model-wise' ? 'model-wise' : 'universal';

  const windows = Array.isArray(body.windows)
    ? body.windows.map((w, wi) => ({
        id: String(w.id || newId(`win${wi}`)),
        title: String(w.title || ''),
        question: String(w.question || ''),
        choiceType: w.choiceType === 'multi' ? 'multi' : 'single',
        options: Array.isArray(w.options)
          ? w.options.map((o, oi) => ({
              id: String(o.id || newId(`opt${wi}${oi}`)),
              label: String(o.label || ''),
              icon: String(o.icon || ''),
              emoji: String(o.emoji || o.icon || ''),
              deductionValue: Number(o.deductionValue) || 0,
            }))
          : [],
      }))
    : [];

  const modelDeductions = Array.isArray(body.modelDeductions)
    ? body.modelDeductions
        .filter((d) => d && d.deviceSlug && d.optionId)
        .map((d) => ({
          deviceSlug: String(d.deviceSlug).trim(),
          optionId: String(d.optionId),
          value: Number(d.value) || 0,
        }))
    : [];

  return {
    category,
    windows,
    deductionMode,
    modelDeductions,
    isActive: body.isActive !== false,
  };
};

export const getPublicCategoryQuiz = async (req, res, next) => {
  try {
    const category = String(req.params.category || '')
      .trim()
      .toLowerCase();

    if (category === SMARTWATCH_QUIZ_CATEGORY) {
      await ensureSmartwatchQuiz();
    }
    if (category === GAMING_QUIZ_CATEGORY) {
      await ensureGamingQuiz();
    }
    if (category === EARBUDS_QUIZ_CATEGORY) {
      await ensureEarbudsQuiz();
    }

    const quiz = await CategoryQuiz.findOne({ category, isActive: true }).lean();
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for category' });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const adminListCategoryQuizzes = async (req, res, next) => {
  try {
    await Promise.all([ensureSmartwatchQuiz(), ensureGamingQuiz(), ensureEarbudsQuiz()]);
    const quizzes = await CategoryQuiz.find().sort({ category: 1 }).lean();
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const adminGetCategoryQuiz = async (req, res, next) => {
  try {
    const quiz = await CategoryQuiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const adminCreateCategoryQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const payload = normalizeQuizPayload(req.body);
    if (!payload.category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const existing = await CategoryQuiz.findOne({ category: payload.category });
    if (existing) {
      return res.status(409).json({ message: 'Quiz already exists for this category' });
    }

    const quiz = await CategoryQuiz.create(payload);
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCategoryQuiz = async (req, res, next) => {
  try {
    const payload = normalizeQuizPayload(req.body);
    if (!payload.category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const clash = await CategoryQuiz.findOne({
      category: payload.category,
      _id: { $ne: req.params.id },
    });
    if (clash) {
      return res.status(409).json({ message: 'Another quiz already uses this category' });
    }

    const quiz = await CategoryQuiz.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCategoryQuiz = async (req, res, next) => {
  try {
    const quiz = await CategoryQuiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};
