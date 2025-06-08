import express from 'express';
import { getUserChats, getChatMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/', protect, getUserChats);
router.get('/:chatId', protect, getChatMessages);
router.post('/:chatId', protect, sendMessage);
export default router;
