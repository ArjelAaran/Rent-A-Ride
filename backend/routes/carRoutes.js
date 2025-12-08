import express from 'express';
import { getAvailableCars, createRental, getCarDetails, getUserRentals, getRentalById } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};
router.get('/:carId', getCarDetails);

router.get('/', getAvailableCars);

router.post('/rentals', protect, upload.single('receipt'), createRental);

router.get('/rentals/:userId', protect, getUserRentals); 

router.get('/rental/:id', protect, getRentalById);

export default router;