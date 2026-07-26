import { Router } from 'express';
import {
  getMyMessages,
  getOrCreateMyConversation,
  sendUserMessage,
  startNewConversation,
} from '../controllers/chat.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import { chatSendLimiter } from '../middleware/rateLimits.js';

const router = Router();

router.use(clientGate);
router.use(auth);

router.get('/conversation', getOrCreateMyConversation);
router.post('/conversations', startNewConversation);
router.get('/messages', getMyMessages);
router.post('/messages', chatSendLimiter, sendUserMessage);

export default router;
