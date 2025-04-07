import express from 'express';
import { sendMessage, getMessages, getUsersForSidebar } from '../controller/messageController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router =  express.Router();

router.get('/users', protectedRoute, getUsersForSidebar);
router.get('/:userId', protectedRoute, getMessages);
router.post('/send/:id', protectedRoute, sendMessage);

export default router;