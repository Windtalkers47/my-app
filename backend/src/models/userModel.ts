import db from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  user_id: number;
  user_name: string;
  user_email: string;
  user_password: string;
  user_create_date: Date;
  role_id: number;
}


export const createUser = async (email: string, passwordHash: string) => {
  const [result] = await db.execute(
    'INSERT INTO users (user_email, user_password) VALUES (?, ?)',
    [email, passwordHash]
  );
  return result;
};

export const findUserByEmail = async (email: string): Promise<UserRow | null> => {
  const [rows] = await db.execute(
    `SELECT u.*, r.role_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_email = ?`,
    [email]
  );
  
  const result = rows as UserRow[];
  return result.length > 0 ? result[0] : null;
};

