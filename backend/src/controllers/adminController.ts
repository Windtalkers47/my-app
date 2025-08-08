// backend/src/controllers/adminController.ts

import { Request, Response } from 'express';
import db from '../utils/db';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// GET /admin/stats
export const getSummaryStats = async (req: Request, res: Response) => {
  try {
    const [userRows] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [productRows] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [bookingRows] = await db.query('SELECT COUNT(*) as totalBookings FROM table_bookings');
    const [revenueRows] = await db.query('SELECT SUM(price * quantity) as totalRevenue FROM cart_items');

    const totalUsers = (userRows as any)[0]?.totalUsers || 0;
    const totalProducts = (productRows as any)[0]?.totalProducts || 0;
    const totalBookings = (bookingRows as any)[0]?.totalBookings || 0;
    const totalRevenue = (revenueRows as any)[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalBookings,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary stats' });
  }
};


// GET /admin/bookings/report?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getBookingReport = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT b.table_booking_id, u.username, b.table_id, b.booking_date, b.booking_time, b.number_of_people, b.status
       FROM table_bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.booking_date BETWEEN ? AND ?
       ORDER BY b.booking_date DESC`,
      [from, to]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booking report' });
  }
};

// GET /admin/products/report?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getProductSalesReport = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT p.name, SUM(ci.quantity) as total_sold, SUM(ci.price * ci.quantity) as total_revenue
       FROM cart_items ci
       JOIN cart c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.updated_at BETWEEN ? AND ?
       GROUP BY ci.product_id
       ORDER BY total_sold DESC`,
      [from, to]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product report' });
  }
};

// GET /admin/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.user_name, u.user_email, r.role_name AS role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.role_id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


// PUT /admin/user/:id/role
export const updateUserRole = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { roleId } = req.body;
  try {
    await db.execute('UPDATE users SET role_id = ? WHERE id = ?', [roleId, userId]);
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// GET /admin/report/export?type=bookings&format=excel|pdf&from=...&to=...
export const exportReport = async (req: Request, res: Response) => {
  const { type, format, from, to } = req.query;

  try {
    let data: any[] = [];
    if (type === 'bookings') {
      const [rows] = await db.query(
        `SELECT b.table_booking_id, u.username, b.table_id, b.booking_date, b.booking_time, b.number_of_people, b.status
         FROM table_bookings b
         JOIN users u ON b.user_id = u.id
         WHERE b.booking_date BETWEEN ? AND ?`,
        [from, to]
      );
      data = rows as any[];
    } else if (type === 'products') {
      const [rows] = await db.query(
        `SELECT p.name, SUM(ci.quantity) as total_sold, SUM(ci.price * ci.quantity) as total_revenue
         FROM cart_items ci
         JOIN cart c ON ci.cart_id = c.id
         JOIN products p ON ci.product_id = p.id
         WHERE c.updated_at BETWEEN ? AND ?
         GROUP BY ci.product_id`,
        [from, to]
      );
      data = rows as any[];
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Report');
      sheet.columns = Object.keys(data[0] || {}).map((key) => ({ header: key, key }));
      sheet.addRows(data);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
      await workbook.xlsx.write(res);
      res.end();
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`);
      doc.pipe(res);
      doc.fontSize(14).text(`${type.toString().toUpperCase()} REPORT`, { align: 'center' });
      doc.moveDown();
      data.forEach((row) => {
        Object.entries(row).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`);
        });
        doc.moveDown();
      });
      doc.end();
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export report' });
  }
};
