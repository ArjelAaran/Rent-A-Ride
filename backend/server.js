import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(express.json()); 

app.use('/api/auth', authRoutes); // Auth: /register, /login
app.use('/api/cars', carRoutes); // Cars/Rentals: /, /rentals, /rentals/:userId
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Rent-A-Ride Backend API is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});