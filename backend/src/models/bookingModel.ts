import db from '../utils/db';

export const createBooking = async (
  userId: number,
  tableId: number,
  bookingDate: string,
  bookingTime: string,
  numberOfPeople: number,
  specialRequest?: string
) => {
  const SPARE_CHAIRS = 6; // เก้าอี้สำรอง มี 6 ตัว

  // Check ว่ามีโต๊ะจริงมั้ย
  const [tableResult] = await db.query('SELECT * FROM tables WHERE table_id = ?', [tableId]);
  const table = (tableResult as any[])[0];

  if (!table) {
    throw new Error('Table does not exist.');
  }

  const maxAvailableSeats = table.seats + SPARE_CHAIRS;

  // Check จำนวนที่นั่ง มากกว่าที่มีในโต๊ะหรือป่าว
  if (numberOfPeople > maxAvailableSeats) {
    throw new Error(`Table ${tableId} cannot accommodate ${numberOfPeople} people. Maximum with spare chairs is ${maxAvailableSeats}.`);
  }

  // Check ว่ามีการจองซ้ำกันมั้ย
  const [existingBooking] = await db.query(
    `SELECT * FROM table_bookings 
     WHERE table_id = ? AND booking_date = ? AND booking_time = ? AND status IN ('pending', 'confirmed')`,
    [tableId, bookingDate, bookingTime]
  );

  if ((existingBooking as any[]).length > 0) {
    throw new Error('Table already booked for this date and time.');
  }

  const [result] = await db.execute(
    `INSERT INTO table_bookings (user_id, table_id, booking_date, booking_time, number_of_people, special_request)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, tableId, bookingDate, bookingTime, numberOfPeople, specialRequest || null]
  );

  return result;
};


export const getUserBookings = async (userId: number) => {
  const [rows] = await db.execute(
    `SELECT * FROM table_bookings
     WHERE user_id = ?
     AND booking_date >= CURDATE()
     AND status != 'cancelled'
     ORDER BY booking_date ASC, booking_time ASC`,
    [userId]
  );
  return rows;
};

export const updateBooking = async (
  bookingId: number,
  userId: number,
  tableId: number,
  bookingDate: string,
  bookingTime: string,
  numberOfPeople: number,
  specialRequest?: string
) => {

  const SPARE_CHAIRS = 6; // เก้าอี้สำรอง มี 6 ตัว

  const [tableResult] = await db.query(
    `SELECT * FROM tables WHERE table_id = ?`,
    [tableId]
  );

  const table = (tableResult as any[])[0];
  if (!table) {
    throw new Error(`Table with ID ${tableId} not found.`);
  }

  const maxAvailableSeats = table.seats + SPARE_CHAIRS;

    // Check จำนวนที่นั่ง มากกว่าที่มีในโต๊ะหรือป่าว
  if (numberOfPeople > maxAvailableSeats) {
    throw new Error(`Table ${tableId} cannot accommodate ${numberOfPeople} people. Maximum with spare chairs is ${maxAvailableSeats}.`);
  }

  const [existingBooking] = await db.query(
    `SELECT * FROM table_bookings 
     WHERE table_id = ? AND booking_date = ? AND booking_time = ? AND table_booking_id != ? AND status IN ('pending', 'confirmed')`,
    [tableId, bookingDate, bookingTime, bookingId]
  );

  // ดักการจองซ้ำ
  if ((existingBooking as any[]).length > 0) {
    throw new Error('Table already booked for this date and time.');
  }

  const [result] = await db.execute(
    `UPDATE table_bookings
     SET table_id = ?, booking_date = ?, booking_time = ?, number_of_people = ?, special_request = ?
     WHERE table_booking_id = ? AND user_id = ?`,
    [
      tableId,
      bookingDate,
      bookingTime,
      numberOfPeople,
      specialRequest || null,
      bookingId,
      userId
    ]
  );

  return result;
};

export const cancelBooking = async (bookingId: number, userId: number) => {

  // validate check Table
  const [result] = await db.execute(
    `UPDATE table_bookings SET status = 'cancelled' WHERE table_booking_id = ? AND user_id = ?`,
    [bookingId, userId]
  );
  return result;
};

export const getAllBookings = async () => {
  const [rows] = await db.query(`
    SELECT tb.*, u.user_name AS userName, t.table_number, t.seats AS seat_capacity
    FROM table_bookings tb
    JOIN users u ON tb.user_id = u.user_id
    JOIN tables t ON tb.table_id = t.table_id
    ORDER BY tb.booking_date DESC, tb.booking_time DESC
  `);
  return rows;
};

export const listAvailableTables = async (bookingDate: string, bookingTime: string) => {
  const [unavailableTables] = await db.query(
    `SELECT table_id FROM table_bookings
     WHERE booking_date = ? AND booking_time = ? AND status IN ('pending', 'confirmed')`,
    [bookingDate, bookingTime]
  );

  const unavailableIds = (unavailableTables as any[]).map(row => row.table_id);

  let query = `SELECT * FROM tables`;
  let params: any[] = [];

  if (unavailableIds.length > 0) {
    const placeholders = unavailableIds.map(() => '?').join(',');
    query += ` WHERE table_id NOT IN (${placeholders})`;
    params = unavailableIds;
  }

  const [availableTables] = await db.query(query, params);
  return availableTables;
};


export const getTablesWithAvailability = async (bookingDate: string, bookingTime: string) => {
  const [allTables] = await db.query(`SELECT * FROM tables`);

  const [bookedTables] = await db.query(
    `SELECT table_id FROM table_bookings
     WHERE booking_date = ? AND booking_time = ? AND status IN ('pending', 'confirmed')`,
    [bookingDate, bookingTime]
  );

  const bookedIds = (bookedTables as any[]).map(row => row.table_id);

  const tablesWithStatus = (allTables as any[]).map(table => ({
    ...table,
    isBooked: bookedIds.includes(table.table_id),
  }));

  return tablesWithStatus;
};

