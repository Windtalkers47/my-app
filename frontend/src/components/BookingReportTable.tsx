// src/components/BookingReportTable.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';

type Booking = {
  booking_id: number;
  user_id: number;
  table_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  special_request?: string;
};

const BookingReportTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/admin/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Booking Report</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Table</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">People</th>
              <th className="p-2">Request</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="border-t">
                <td className="p-2">{booking.booking_id}</td>
                <td className="p-2">{booking.user_id}</td>
                <td className="p-2">{booking.table_id}</td>
                <td className="p-2">{booking.booking_date}</td>
                <td className="p-2">{booking.booking_time}</td>
                <td className="p-2">{booking.number_of_people}</td>
                <td className="p-2">{booking.special_request || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingReportTable;
