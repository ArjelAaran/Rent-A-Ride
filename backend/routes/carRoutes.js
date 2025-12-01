// backend/routes/carRoutes.js
import express from 'express';
import { getAvailableCars, createRental, getUserRentals } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Functional Endpoint 3: GET /api/cars (CRUD: Read - Cars List)
router.get('/', getAvailableCars);

// Functional Endpoint 4: POST /api/cars/rentals (CRUD: Create - Rental Booking) - Protected
router.post('/rentals', protect, createRental);

// Functional Endpoint 5: GET /api/cars/rentals/:userId (CRUD: Read - User Rentals) - Protected
router.get('/rentals/:userId', protect, getUserRentals); 

export default router;