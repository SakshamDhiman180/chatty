import express from 'express';
import { sendMessage, getMessages, getUsersForSidebar } from '../controller/messageController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router =  express.Router();

router.get('/users', protectedRoute, getUsersForSidebar);

export default router;