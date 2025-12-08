import pool from '../db.js';

export const getAvailableCars = async (req, res) => {
    try {
        const [cars] = await pool.query('SELECT car_id, model, make, year, type, daily_rate, image_url FROM cars WHERE is_available = TRUE');
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error fetching cars' });
    }
};

export const getCarDetails = async (req, res) => {
    const { carId } = req.params; 

    const sql = 'SELECT car_id, make, model, daily_rate, image_url FROM cars WHERE car_id = ?';

    try {
        const [results] = await pool.query(sql, [carId]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        res.status(200).json(results[0]);

    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).json({ message: 'Server error while fetching car details.' });
    }
};

export const createRental = async (req, res) => {
    const user_id = req.user.id; 
    const { carId, startDate, endDate, totalCost, paymentMethod } = req.body;
    
    const proofOfPayment = req.file ? `/uploads/${req.file.filename}` : null;

    let status = 'pending';
    const methodClean = paymentMethod ? paymentMethod.trim() : '';

    if (methodClean === 'online' && proofOfPayment) {
        status = 'paid';
    }

    console.log('--- NEW BOOKING REQUEST ---');
    console.log('User:', user_id);
    console.log('Method:', paymentMethod);
    console.log('Proof:', proofOfPayment);
    console.log('CALCULATED STATUS:', status); 

    try {
        const [result] = await pool.query(
            `INSERT INTO rentals 
            (user_id, car_id, start_date, end_date, total_cost, status, payment_method, proof_of_payment_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, 
                carId, 
                startDate, 
                endDate, 
                totalCost, 
                status,         
                paymentMethod, 
                proofOfPayment
            ]
        );
        
        res.status(201).json({ 
            message: 'Rental booked successfully.', 
            rentalId: result.insertId 
        });

    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({ message: 'Server error booking rental' });
    }
};

export const getUserRentals = async (req, res) => {
    const user_id = req.params.userId;

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

export const getRentalById = async (req, res) => {
    const rentalId = req.params.id;
    const userId = req.user.id; 

    try {
        const [rentals] = await pool.query(
            `SELECT 
                r.rental_id, r.start_date, r.end_date, r.total_cost, r.status,
                c.make, c.model, c.year, c.image_url, c.daily_rate
             FROM rentals r
             JOIN cars c ON r.car_id = c.car_id
             WHERE r.rental_id = ? AND r.user_id = ?`,
            [rentalId, userId]
        );

        if (rentals.length === 0) {
            return res.status(404).json({ message: 'Rental not found or access denied.' });
        }

        res.json(rentals[0]);
    } catch (error) {
        console.error('Error fetching rental:', error);
        res.status(500).json({ message: 'Server error fetching rental details' });
    }
};

export const uploadRentalPayment = async (req, res) => {
    const rentalId = req.params.id;
    const userId = req.user.id;
    
    const proofOfPayment = req.file ? `/uploads/${req.file.filename}` : null;

    if (!proofOfPayment) {
        return res.status(400).json({ message: 'No receipt file uploaded.' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE rentals 
             SET proof_of_payment_url = ?, status = 'paid', payment_method = 'online'
             WHERE rental_id = ? AND user_id = ?`,
            [proofOfPayment, rentalId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rental not found or update failed.' });
        }

        res.json({ message: 'Payment uploaded successfully. Status updated to Paid.' });

    } catch (error) {
        console.error('Error uploading payment:', error);
        res.status(500).json({ message: 'Server error updating payment.' });
    }
};