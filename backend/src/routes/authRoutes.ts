import express from 'express';
import { body } from 'express-validator';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';

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

// Cookie-based auth endpoints
router.get('/verify-auth', authenticateToken, (req, res) => {
  res.status(200).json({ authenticated: true });
});

router.get('/user-role', authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.json({ role: user.role });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome, admin');
});

// Refresh token endpoint
router.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    // Generate new access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    // Set new access token cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ message: 'Token refreshed' });
  });
});

export default router;
