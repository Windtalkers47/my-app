import express from 'express';
import { body } from 'express-validator';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/register', 
    // Check Validate
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  register
);

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ตัวอย่าง route ที่ต้อง login ก่อน
router.get('/me', authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'You are authenticated', user });
});

router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome, admin');
});

export default router;
