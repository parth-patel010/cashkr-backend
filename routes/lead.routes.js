import { Router } from 'express';
import { createLead, uploadLeadPhoto } from '../controllers/lead.controller.js';
import { uploadLeadImage } from '../middleware/upload.js';
import { orderCreateLimiter } from '../middleware/rateLimits.js';

const router = Router();

router.post('/upload-photo', orderCreateLimiter, uploadLeadImage.single('photo'), uploadLeadPhoto);
router.post('/', orderCreateLimiter, createLead);

export default router;
