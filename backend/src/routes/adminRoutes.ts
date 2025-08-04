import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import {
  getSummaryStats,
  getBookingReport,
  updateUserRole,
  exportReport,
} from '../controllers/adminController';

const router = express.Router();

router.get('/stats', authenticateToken, getSummaryStats);
router.get('/bookings/report', authenticateToken, getBookingReport);
router.put('/user/:id/role', authenticateToken, updateUserRole);
router.get('/report/export', authenticateToken, exportReport);

router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome, admin');
});

export default router;
