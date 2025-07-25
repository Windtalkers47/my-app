import db from '../utils/db';

export const createBooking = async (
  userId: number,
  bookingDate: string,
  bookingTime: string,
  numberOfPeople: number,
  specialRequest?: string
) => {
  const [result] = await db.execute(
    `INSERT INTO table_bookings (user_id, booking_date, booking_time, number_of_people, special_request)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, bookingDate, bookingTime, numberOfPeople, specialRequest || null]
  );
  return result;
};

export const getUserBookings = async (userId: number) => {
  const [rows] = await db.execute(
    `SELECT * FROM table_bookings WHERE user_id = ? ORDER BY booking_date DESC`,
    [userId]
  );
  return rows;
};

// Update a booking
export const updateBooking = async (
  bookingId: number,
  userId: number,
  bookingDate: string,
  bookingTime: string,
  numberOfPeople: number,
  specialRequest?: string
) => {
  const [result] = await db.execute(
    `UPDATE table_bookings
     SET booking_date = ?, booking_time = ?, number_of_people = ?, special_request = ?
     WHERE table_booking_id = ? AND user_id = ?`,
    [bookingDate, bookingTime, numberOfPeople, specialRequest || null, bookingId, userId]
  );
  return result;
};

// Cancel a booking
export const cancelBooking = async (bookingId: number, userId: number) => {
  const [result] = await db.execute(
    `UPDATE table_bookings SET status = 'cancelled' WHERE table_booking_id = ? AND user_id = ?`,
    [bookingId, userId]
  );
  return result;
};

