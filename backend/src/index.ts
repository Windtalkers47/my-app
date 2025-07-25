import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

import cartRoutes from './routes/cartRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend port
  credentials: true
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
