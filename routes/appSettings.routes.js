import { Router } from 'express';
import { getPublicAppSettings } from '../controllers/appSettings.controller.js';

const router = Router();
router.get('/', getPublicAppSettings);
export default router;
