import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Try to get token from Authorization header (backward compatibility)
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    token = authHeader.split(' ')[1]; // Bearer TOKEN
  }
  
  // If no token in header, try to get it from cookies
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user; // attach user to request
    next();
  });
};

