import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  handleCreateBooking,
  handleGetMyBookings,
  handleUpdateBooking,
  handleCancelBooking,
  handleGetAllBookings,
  handleListAvailableTables
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', authenticateToken, handleCreateBooking);
router.get('/my', authenticateToken, handleGetMyBookings);
router.put('/:id', authenticateToken, handleUpdateBooking);
router.patch('/:id/cancel', authenticateToken, handleCancelBooking);

router.get('/all', authenticateToken, handleGetAllBookings);
router.get('/available', authenticateToken, handleListAvailableTables);

export default router;
