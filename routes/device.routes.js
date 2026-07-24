import { Router } from 'express';
import {
  getBrands,
  getModels,
  getDeviceBySlug,
  calculatePrice,
  searchDevices,
  getSitemapUrls,
  getMostQuoted,
  recordQuiz,
} from '../controllers/device.controller.js';

const router = Router();

router.get('/search', searchDevices);
router.get('/sitemap-urls', getSitemapUrls);
router.get('/most-quoted', getMostQuoted);
router.get('/brands', getBrands);
router.get('/models', getModels);
router.post('/:slug/record-quiz', recordQuiz);
router.get('/:slug', getDeviceBySlug);
router.post('/calculate-price', calculatePrice);

export default router;
