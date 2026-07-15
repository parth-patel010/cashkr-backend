import { Router } from 'express';
import {
  getMyMessages,
  getOrCreateMyConversation,
  sendUserMessage,
} from '../controllers/chat.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.use(clientGate);
router.use(auth);

router.get('/conversation', getOrCreateMyConversation);
router.get('/messages', getMyMessages);
router.post('/messages', sendUserMessage);

export default router;
