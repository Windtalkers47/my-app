import CryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import { validationResult } from 'express-validator';


import crypto from 'crypto'; // token generate สำหรับ forgot password
import db from '../utils/db';

//#region Register
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // 🔓 Decrypt password จาก frontend
    const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET_KEY!);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedPassword)
      return res.status(400).json({ message: 'Invalid encrypted password' });

    // 🔐 Hash it
    const hash = await bcrypt.hash(decryptedPassword, 10);

    // 🧑‍💻 Save it
    await createUser(email, hash);

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//#endregion

//#region Login
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

// 🔓 ถอดรหัสก่อนเช็ค
const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET_KEY!);
const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

if (!decryptedPassword)
  return res.status(400).json({ message: 'Decryption failed or empty password' });

const user = await findUserByEmail(email);
if (!user) return res.status(401).json({ message: 'Invalid credentials' });

const valid = await bcrypt.compare(decryptedPassword, user.user_password);
if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

const token = jwt.sign(
  {
    id: user.user_id,
    email: user.user_email,
    role: user.role_name
  },
  process.env.JWT_SECRET!,
  { expiresIn: '24h' }
);



  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      create_date: user.user_create_date,
      role: user.role_name
    },
  });
};

//#endregion

//#region forgotPassword

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 ชั่วโมง

    // Insert
    await db.execute(
      'INSERT INTO password_resets (user_id, reset_token, expires_at) VALUES (?, ?, ?)',
      [user.user_id, token, expires]
    );

    // Send email testing
    return res.status(200).json({ message: 'Reset link sent', token }); // return token only for testing
  } catch (err) {
    console.error('Forgot Password Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//#endregion

//#region  resetPassword
export const resetPassword = async (req: Request, res: Response) => {
const { token, newPassword } = req.body;

  try {
    const [rows]: any = await db.execute(
      'SELECT * FROM password_resets WHERE reset_token = ? AND expires_at > NOW()',
      [token]
    );

    const resetRequest = rows[0];
    if (!resetRequest) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.execute(
      'UPDATE users SET user_password = ? WHERE user_id = ?',
      [hashedPassword, resetRequest.user_id]
    );

    // Delete reset token after use
    await db.execute('DELETE FROM password_resets WHERE id = ?', [resetRequest.id]);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//#endregion
