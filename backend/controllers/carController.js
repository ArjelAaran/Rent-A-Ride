import pool from '../db.js';

// --- READ: Get all available cars (Used by HomeView.vue) ---
export const getAvailableCars = async (req, res) => {
    try {
        const [cars] = await pool.query('SELECT car_id, model, make, year, type, daily_rate, image_url FROM cars WHERE is_available = TRUE');
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error fetching cars' });
    }
};

// --- READ: Get single car details by ID (Used by BookingView.vue) ---
export const getCarDetails = async (req, res) => {
    const { carId } = req.params; // Get carId from the URL parameter

    // Query to select necessary details for the booking form
    const sql = 'SELECT car_id, make, model, daily_rate, image_url FROM cars WHERE car_id = ?';

    try {
        const [results] = await pool.query(sql, [carId]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        // Return the single car object
        res.status(200).json(results[0]);

    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).json({ message: 'Server error while fetching car details.' });
    }
};

// --- CREATE: Create a new rental booking (Used by BookingView.vue form submission) ---
export const createRental = async (req, res) => {
    // req.user.id is populated by the authMiddleware from the JWT token
    const user_id = req.user.id; 
    const { carId, startDate, endDate, totalCost } = req.body;

    try {
        // Log the received data for debugging
        console.log(`Creating rental for User ${user_id} and Car ${carId} with cost ${totalCost}`);

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

// --- READ: Get rentals for a specific user (Used by CustomerDashboardView.vue) ---
export const getUserRentals = async (req, res) => {
    const user_id = req.params.userId;

    // Security Check: Prevent a user from viewing another user's rentals
    if (user_id != req.user.id) {
        return res.status(403).json({ message: 'Forbidden access to another user\'s rentals.' });
    }

    try {
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