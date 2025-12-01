// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173' // IMPORTANT: Change this if your Vue port is different
}));
app.use(express.json()); 

// API Routes (3+ Functional Endpoints)
app.use('/api/auth', authRoutes); // Auth: /register, /login
app.use('/api/cars', carRoutes); // Cars/Rentals: /, /rentals, /rentals/:userId

app.get('/', (req, res) => {
    res.send('Rent-A-Ride Backend API is running.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});