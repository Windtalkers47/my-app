// src/components/BookingReportTable.tsx

import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';

type Booking = {
  table_booking_id: number;
  user_name: string;
  table_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  status: string;
};

const BookingReportTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // format เป็น dd-mm-yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // ไม่มีเดือนที่ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchBookings = async () => {
    try {
      const params: any = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      
      const res = await apiClient.get('/api/admin/bookings/report', { params });
      setBookings(res.data);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลการจองได้';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilter = () => {
    fetchBookings();
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    // Fetch all bookings without date filter
    fetchBookings();
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Booking Report</h2>
      
      {/* Date Filter Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>
      
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
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.table_booking_id} className="border-t">
                <td className="p-2">{booking.table_booking_id}</td>
                <td className="p-2">{booking.user_name}</td>
                <td className="p-2">{booking.table_id}</td>
                <td className="p-2">{formatDate(booking.booking_date)}</td>
                <td className="p-2">{booking.booking_time}</td>
                <td className="p-2">{booking.number_of_people}</td>
                <td className="p-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingReportTable;
