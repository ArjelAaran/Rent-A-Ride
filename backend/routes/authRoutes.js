import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/user', protect, getUser);

router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;