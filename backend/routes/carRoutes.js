import express from 'express';
import { getAvailableCars, createRental, getCarDetails, getUserRentals } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:carId', getCarDetails);

router.get('/', getAvailableCars);

router.post('/rentals', protect, createRental);

router.get('/rentals/:userId', protect, getUserRentals); 

export default router;