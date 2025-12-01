// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Functional Endpoint 1: POST /api/auth/register (CRUD: Create)
router.post('/register', registerUser);

// Functional Endpoint 2: POST /api/auth/login
router.post('/login', loginUser);

export default router;