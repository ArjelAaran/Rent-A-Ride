// backend/controllers/carController.js
import pool from '../db.js';

// GET /api/cars (CRUD: Read - Car List)
export const getAvailableCars = async (req, res) => {
    try {
        // Fetches data to display on HomeView.vue
        const [cars] = await pool.query('SELECT car_id, model, make, year, type, daily_rate, image_url FROM cars WHERE is_available = TRUE');
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error fetching cars' });
    }
};

// POST /api/cars/rentals (CRUD: Create - Rental Booking)
export const createRental = async (req, res) => {
    // user_id is passed from the token via the 'protect' middleware
    const user_id = req.user.id; 
    const { carId, startDate, endDate, totalCost } = req.body;

    try {
        // Insert into RENTALS table
        const [result] = await pool.query(
            'INSERT INTO rentals (user_id, car_id, start_date, end_date, total_cost, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, carId, startDate, endDate, totalCost, 'pending']
        );
        
        res.status(201).json({ 
            message: 'Rental booked successfully. Status: Pending', 
            rentalId: result.insertId 
        });

    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({ message: 'Server error booking rental' });
    }
};

// GET /api/cars/rentals/:userId (CRUD: Read - User Rentals)
export const getUserRentals = async (req, res) => {
    const user_id = req.params.userId;

    // Security check: ensure the user fetching the rentals is the logged-in user
    if (user_id != req.user.id) {
        return res.status(403).json({ message: 'Forbidden access to another user\'s rentals.' });
    }

    try {
        // Joins rentals with car data to display full details on Dashboard
        const [rentals] = await pool.query(
            `SELECT 
                r.rental_id, r.start_date, r.end_date, r.total_cost, r.status, 
                c.make, c.model, c.year, c.daily_rate 
            FROM rentals r
            JOIN cars c ON r.car_id = c.car_id
            WHERE r.user_id = ?
            ORDER BY r.start_date DESC`, 
            [user_id]
        );
        
        res.json(rentals);

    } catch (error) {
        console.error('Error fetching user rentals:', error);
        res.status(500).json({ message: 'Server error fetching rentals' });
    }
};