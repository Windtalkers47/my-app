import express from 'express';
import { handleCreateBooking, handleGetMyBookings , handleUpdateBooking, handleCancelBooking } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, handleCreateBooking);
router.get('/my', authenticateToken, handleGetMyBookings);
router.put('/:id', authenticateToken, handleUpdateBooking);
router.patch('/:id/cancel', authenticateToken, handleCancelBooking);

export default router;
