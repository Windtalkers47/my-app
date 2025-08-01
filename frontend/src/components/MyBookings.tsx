import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type MyBooking = {
  table_booking_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  special_request: string | null;
  table_id: number;
  status: string;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const token = localStorage.getItem('token');

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Booking cancelled');
      fetchMyBookings(); // Refresh
    } catch {
      toast.error('Cancel failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">📅 My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.table_booking_id} className="p-4 border rounded-md shadow-sm">
              {/* <div><strong>📅 วันที่:</strong> {b.booking_date}</div> */}
              <div><strong>📅 วันที่:</strong> {new Date(b.booking_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><strong>⏰ เวลา:</strong> {b.booking_time}</div>
              <div><strong>👥 จำนวนคน:</strong> {b.number_of_people}</div>
              <div><strong>Table ID:</strong> {b.table_id}</div>
              <div><strong>Status:</strong> <span className="capitalize">{b.status}</span></div>
              {b.special_request && <div><strong>📝 คำขอพิเศษ:</strong> {b.special_request}</div>}

              <div className="mt-2 space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => toast('TODO: Open edit modal for booking ID ' + b.table_booking_id)}
                >
                  Edit
                </button>
                {b.status !== 'cancelled' && (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleCancel(b.table_booking_id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
