import { Router } from 'express';
import clientGate from '../middleware/clientGate.js';
import { getPublicCategoryQuiz } from '../controllers/categoryQuiz.controller.js';

const router = Router();

router.get('/:category', clientGate, getPublicCategoryQuiz);

export default router;
