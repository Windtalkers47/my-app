import { Request, Response } from 'express';
import {
  createBooking,
  getUserBookings,
  updateBooking,
  cancelBooking,
  getAllBookings,
  listAvailableTables,
  getTablesWithAvailability
} from '../models/bookingModel';

export const handleCreateBooking = async (req: Request, res: Response) => {
  const { tableId, bookingDate, bookingTime, numberOfPeople, specialRequest } = req.body;
  const userId = (req as any).user.id;

  try {
    const booking = await createBooking(userId, tableId, bookingDate, bookingTime, numberOfPeople, specialRequest);
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const handleGetAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json(bookings);
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleListAvailableTables = async (req: Request, res: Response) => {
  const { bookingDate, bookingTime } = req.query;

  if (!bookingDate || !bookingTime) {
    return res.status(400).json({ error: 'Missing bookingDate or bookingTime' });
  }

  try {
    const tables = await listAvailableTables(bookingDate as string, bookingTime as string);
    res.status(200).json(tables);
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetMyBookings = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const bookings = await getUserBookings(userId);
    res.status(200).json(bookings);
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const handleUpdateBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const userId = (req as any).user.id;
  const { tableId, bookingDate, bookingTime, numberOfPeople, specialRequest } = req.body;

  if (!tableId) return res.status(400).json({ error: 'Missing tableId' });

  try {
    const result = await updateBooking(bookingId, userId, tableId, bookingDate, bookingTime, numberOfPeople, specialRequest);
    res.status(200).json({ message: 'Booking updated successfully', result });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel
export const handleCancelBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const userId = (req as any).user.id;

  // เหลือ Check ว่ามีโต๊ะที่จองอยู่หรือไม่

  try {
    const result = await cancelBooking(bookingId, userId);
    res.status(200).json({ message: 'Booking cancelled successfully', result });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

// สำหรับไว้โชว์โต๊ะให้เลือกจอง
export const getAvailableTables = async (req: Request, res: Response) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ error: "Missing date or time" });
    }

    const tables = await getTablesWithAvailability(date as string, time as string);
    res.json(tables);
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};