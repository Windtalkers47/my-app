import { Request, Response } from 'express';
import { createBooking, getUserBookings, updateBooking, cancelBooking } from '../models/bookingModel';

export const handleCreateBooking = async (req: Request, res: Response) => {
  const { bookingDate, bookingTime, numberOfPeople, specialRequest } = req.body;
  const userId = (req as any).user.id;

  try {
    const booking = await createBooking(userId, bookingDate, bookingTime, numberOfPeople, specialRequest);
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const handleGetMyBookings = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const bookings = await getUserBookings(userId);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Update handler
export const handleUpdateBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const userId = (req as any).user.id;
  const { bookingDate, bookingTime, numberOfPeople, specialRequest } = req.body;

  try {
    const result = await updateBooking(bookingId, userId, bookingDate, bookingTime, numberOfPeople, specialRequest);
    res.status(200).json({ message: 'Booking updated successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Cancel handler
export const handleCancelBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const userId = (req as any).user.id;

  try {
    const result = await cancelBooking(bookingId, userId);
    res.status(200).json({ message: 'Booking cancelled successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};