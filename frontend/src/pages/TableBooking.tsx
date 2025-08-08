import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

type Table = {
  table_id: number;
  table_number: string;
  seats: number;
  isBooked: boolean;
};

const TableBooking = () => {

  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState<number | undefined>();
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchAvailableTables = async () => {
    if (!bookingDate || !timeSlot) return;
    try {
      const res = await apiClient.get('/api/bookings/available-tables', {
        params: { date: bookingDate, time: timeSlot.split('-')[0] },
      });
      setAvailableTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch available tables');
    }
  };

  useEffect(() => {
    fetchAvailableTables();
  }, [bookingDate, timeSlot]);

  const handleBooking = async () => {
    if (!bookingDate || !timeSlot === null) {
      toast.error('Please select date, time');
      return;
    }

    if (!numberOfPeople || numberOfPeople < 1) {
      toast.error('Please enter number of people');
      return;
    }

        if (selectedTableId === null) {
      toast.error('Please select table');
      return;
    }

    setLoading(true);

      try {
      await apiClient.post(
        '/api/bookings',
        {
          bookingDate,
          bookingTime: timeSlot.split('-')[0],
          tableId: selectedTableId,
          numberOfPeople: numberOfPeople,
          specialRequest: specialRequest || null,
        }
      );

      toast.success('Booking successful!');
      setShowSuccessModal(true); // Optional: You can enable this for a modal popup

      setSelectedTableId(null);
      setNumberOfPeople(undefined);

      fetchAvailableTables(); // Refresh availability
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">📅 จองโต๊ะร้านอาหาร</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">เลือกวันที่</label>
        <input
          type="date"
          className="border rounded w-full p-2"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">เลือกเวลา</label>
        <select
          className="border rounded w-full p-2"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="">-- เลือกเวลา --</option>
          <option value="18:00-20:00">18:00 - 20:00</option>
          <option value="20:00-22:00">20:00 - 22:00</option>
          <option value="22:00-00:00">22:00 - 00:00</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">จำนวนคน</label>
        <input
          type="number"
          className="border rounded w-full p-2"
          value={numberOfPeople || ''}
          onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
          min={1}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">คำขอพิเศษ</label>
        <textarea
          rows={2}
          className="border rounded w-full p-2"
          placeholder="เช่น ขอใกล้หน้าต่าง หรือ ขอเก้าอี้เสริมสำหรับเด็ก"
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2">เลือกโต๊ะ</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {availableTables.length === 0 ? (
            <p className="col-span-full text-gray-500">ไม่มีโต๊ะว่างในช่วงเวลานี้</p>
          ) : (
            availableTables.map((table) => (
            <button
              key={table.table_id}
              onClick={() => !table.isBooked && setSelectedTableId(table.table_id)}
              disabled={table.isBooked}
              className={`p-4 border rounded-lg text-center transition ${
                table.isBooked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : selectedTableId === table.table_id
                    ? 'bg-green-500 text-white'
                    : 'hover:bg-gray-100'
              }`}
            >
              โต๊ะ {table.table_number}
              <br />
              {table.seats} ที่นั่ง
              {table.isBooked && <div className="text-xs mt-1">ถูกจองแล้ว</div>}
            </button>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className={`w-full py-2 rounded-lg mt-4 transition text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'กำลังจอง...' : 'ยืนยันการจองโต๊ะ'}
      </button>

      {/* Optional success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold mb-2">🎉 จองสำเร็จ!</h3>
            <p className="mb-4">ขอบคุณที่ใช้บริการ</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowSuccessModal(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBooking;
