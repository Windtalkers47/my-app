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
    <div className="cafe-card p-6 fade-in">
      {/* <h2 className="cafe-subheading mb-6">รายงานการจอง</h2> */}
      
      {/* Date Filter Controls */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-cafe-light p-6 rounded-xl">
        <div>
          <label className="cafe-label mb-2">จากวันที่</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="cafe-input w-full"
          />
        </div>
        <div>
          <label className="cafe-label mb-2">ถึงวันที่</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="cafe-input w-full"
          />
        </div>
        <div className="flex flex-col justify-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="btn-cafe flex-1"
            >
              กรองข้อมูล
            </button>
            <button
              onClick={handleReset}
              className="btn-cafe-outline flex-1"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-cafe-secondary">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-cafe-primary text-cafe-light">
              <th className="p-4 font-semibold rounded-tl-xl">ID</th>
              <th className="p-4 font-semibold">ผู้ใช้</th>
              <th className="p-4 font-semibold">โต๊ะ</th>
              <th className="p-4 font-semibold">วันที่</th>
              <th className="p-4 font-semibold">เวลา</th>
              <th className="p-4 font-semibold">จำนวนคน</th>
              <th className="p-4 font-semibold rounded-tr-xl">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr 
                  key={booking.table_booking_id} 
                  className={`border-t border-cafe-secondary ${index % 2 === 0 ? 'bg-cafe-light' : 'bg-white'}`}
                >
                  <td className="p-4 cafe-text font-medium">{booking.table_booking_id}</td>
                  <td className="p-4 cafe-text">{booking.user_name}</td>
                  <td className="p-4 cafe-text">{booking.table_id}</td>
                  <td className="p-4 cafe-text">{formatDate(booking.booking_date)}</td>
                  <td className="p-4 cafe-text">{booking.booking_time}</td>
                  <td className="p-4 cafe-text">{booking.number_of_people}</td>
                  <td className="p-4 cafe-text">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'confirmed' 
                        ? 'ยืนยันแล้ว' 
                        : booking.status === 'pending' 
                          ? 'รอดำเนินการ' 
                          : 'ยกเลิก'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center cafe-text-light">
                  ไม่พบข้อมูลการจอง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingReportTable;
