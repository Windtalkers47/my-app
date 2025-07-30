import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  handleCreateBooking,
  handleGetMyBookings,
  handleUpdateBooking,
  handleCancelBooking,
  handleGetAllBookings,
  handleListAvailableTables,
  getAvailableTables
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', authenticateToken, handleCreateBooking);
router.get('/my', authenticateToken, handleGetMyBookings);
router.put('/:id', authenticateToken, handleUpdateBooking);
router.patch('/:id/cancel', authenticateToken, handleCancelBooking);

router.get('/all', authenticateToken, handleGetAllBookings); // สำหรับ Admin
router.get('/available', authenticateToken, handleListAvailableTables);
router.get("/available-tables", getAvailableTables);

export default router;
