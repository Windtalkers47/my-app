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

  const [editingBooking, setEditingBooking] = useState<MyBooking | null>(null);
  const [formData, setFormData] = useState({
    table_id: 1,
    booking_date: '',
    booking_time: '',
    number_of_people: 1,
    special_request: '',
  });

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

    const handleEdit = (booking: MyBooking) => {
    setEditingBooking(booking);
    setFormData({
      table_id: booking.table_id,
      booking_date: new Date(booking.booking_date).toLocaleDateString('en-CA'),
      booking_time: booking.booking_time.slice(0, 5),
      number_of_people: booking.number_of_people,
      special_request: booking.special_request || '',
    });
  };

const handleUpdate = async () => {
  if (!editingBooking) return;

  try {
    await axios.put(
      `/api/bookings/${editingBooking.table_booking_id}`,
      {
        tableId: formData.table_id,
        bookingDate: formData.booking_date,
        bookingTime: formData.booking_time,
        numberOfPeople: formData.number_of_people,
        specialRequest: formData.special_request || null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success('Booking updated');
    setEditingBooking(null);
    fetchMyBookings();
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Update failed';
    toast.error(msg);
  }
};


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
              <div><strong>📅 วันที่:</strong> {new Date(b.booking_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><strong>⏰ เวลา:</strong> {b.booking_time}</div>
              <div><strong>👥 จำนวนคน:</strong> {b.number_of_people}</div>
              <div><strong>🪑 Table ID:</strong> {b.table_id}</div>
              <div><strong>Status:</strong> <span className="capitalize">{b.status}</span></div>
              {b.special_request && <div><strong>📝 คำขอพิเศษ:</strong> {b.special_request}</div>}

              <div className="mt-2 space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(b)}
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

      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-xl font-bold text-center">✏️ Edit Booking</h3>

            <label className="block">
              📅 วันที่:
              <input
                type="date"
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
              />
            </label>

            <label className="block">
              ⏰ เวลา:
              <select
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.booking_time}
                onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
              >
                <option value="">-- เลือกเวลา --</option>
                <option value="18:00">18:00 - 20:00</option>
                <option value="20:00">20:00 - 22:00</option>
                <option value="22:00">22:00 - 00:00</option>
              </select>
            </label>

            <label className="block">
              👥 จำนวนคน:
              <input
                type="number"
                min={1}
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.number_of_people}
                onChange={(e) => setFormData({ ...formData, number_of_people: parseInt(e.target.value) })}
              />
            </label>

            <label className="block">
              🪑 Table ID:
              <input
                type="number"
                min={1}
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.table_id}
                onChange={(e) => setFormData({ ...formData, table_id: parseInt(e.target.value) })}
              />
            </label>

            <label className="block">
              📝 คำขอพิเศษ:
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                rows={2}
                value={formData.special_request}
                onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
              />
            </label>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingBooking(null)}
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
