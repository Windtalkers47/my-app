import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

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
  const [editingBooking, setEditingBooking] = useState<MyBooking | null>(null);
  const [formData, setFormData] = useState({
    table_id: 1,
    booking_date: '',
    booking_time: '',
    number_of_people: 1,
    special_request: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get('/api/bookings/my');
        setBookings(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          alert('กรุณาเข้าสู่ระบบ');
          window.location.href = '/';
        } else {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลการจองได้';
          alert(errorMessage);
        }
      }
    };

    fetchBookings();
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
      await apiClient.put(
        `/api/bookings/${editingBooking.table_booking_id}`,
        {
          tableId: formData.table_id,
          bookingDate: formData.booking_date,
          bookingTime: formData.booking_time,
          numberOfPeople: formData.number_of_people,
          specialRequest: formData.special_request || null,
        }
      );

      toast.success('Booking updated');
      setEditingBooking(null);
      setBookings(bookings.map((booking) => (booking.table_booking_id === editingBooking.table_booking_id ? { ...booking, ...formData } : booking)));
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Update failed';
      toast.error(msg);
    }
  };

  const handleCancel = async (bookingId: number) => {
    try {
      await apiClient.patch(`/api/bookings/${bookingId}/cancel`, {});
      toast.success('Booking cancelled');
      setBookings(bookings.filter((booking) => booking.table_booking_id !== bookingId));
    } catch {
      toast.error('Cancel failed');
    }
  };

  return (
    <div className="pt-20 bg-cafe-background min-h-screen">
      <Navbar />
      
      <section className="cafe-section">
        <div className="cafe-container max-w-4xl">
          <h2 className="cafe-heading mb-8 text-center">📅 การจองของฉัน</h2>
          
          {bookings.length === 0 ? (
            <div className="cafe-card p-12 text-center">
              <h3 className="cafe-subheading mb-4">ยังไม่มีการจอง</h3>
              <p className="cafe-text-light mb-6">คุณยังไม่มีการจองโต๊ะในตอนนี้</p>
              <button
                className="btn-cafe"
                onClick={() => window.location.href = '/book-table'}
              >
                จองโต๊ะตอนนี้
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => (
                <div key={b.table_booking_id} className="cafe-card p-6 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">📅</span>
                        <span className="cafe-label mr-2">วันที่:</span>
                        <span className="cafe-text font-medium">
                          {new Date(b.booking_date).toLocaleDateString('th-TH', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">⏰</span>
                        <span className="cafe-label mr-2">เวลา:</span>
                        <span className="cafe-text font-medium">{b.booking_time}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">👥</span>
                        <span className="cafe-label mr-2">จำนวนคน:</span>
                        <span className="cafe-text font-medium">{b.number_of_people}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">🪑</span>
                        <span className="cafe-label mr-2">โต๊ะ:</span>
                        <span className="cafe-text font-medium">{b.table_id}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">📊</span>
                        <span className="cafe-label mr-2">สถานะ:</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-sm ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {b.status === 'confirmed' ? 'ยืนยันแล้ว' : 
                           b.status === 'pending' ? 'รอดำเนินการ' : 'ยกเลิก'}
                        </span>
                      </div>
                      
                      {b.special_request && (
                        <div className="flex items-start mt-2">
                          <span className="text-xl mr-2">📝</span>
                          <div>
                            <span className="cafe-label mb-1 block">คำขอพิเศษ:</span>
                            <span className="cafe-text">{b.special_request}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-cafe-secondary">
                    <button
                      className="btn-cafe-outline flex items-center"
                      onClick={() => handleEdit(b)}
                    >
                      <span className="mr-2">✏️</span> แก้ไข
                    </button>
                    {b.status !== 'cancelled' && (
                      <button
                        className="btn-cafe bg-red-600 hover:bg-red-700 flex items-center"
                        onClick={() => handleCancel(b.table_booking_id)}
                      >
                        <span className="mr-2">🗑️</span> ยกเลิก
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
          <div className="cafe-card p-6 w-full max-w-md">
            <h3 className="cafe-heading mb-6 text-center">✏️ แก้ไขการจอง</h3>

            <div className="space-y-4">
              <div>
                <label className="cafe-label mb-2">📅 วันที่</label>
                <input
                  type="date"
                  className="cafe-input w-full"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                />
              </div>

              <div>
                <label className="cafe-label mb-2">⏰ เวลา</label>
                <select
                  className="cafe-input w-full"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                >
                  <option value="">-- เลือกเวลา --</option>
                  <option value="18:00">18:00 - 20:00</option>
                  <option value="20:00">20:00 - 22:00</option>
                  <option value="22:00">22:00 - 00:00</option>
                </select>
              </div>

              <div>
                <label className="cafe-label mb-2">👥 จำนวนคน</label>
                <input
                  type="number"
                  min={1}
                  className="cafe-input w-full"
                  value={formData.number_of_people}
                  onChange={(e) => setFormData({ ...formData, number_of_people: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="cafe-label mb-2">🪑 โต๊ะ</label>
                <input
                  type="number"
                  min={1}
                  className="cafe-input w-full"
                  value={formData.table_id}
                  onChange={(e) => setFormData({ ...formData, table_id: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="cafe-label mb-2">📝 คำขอพิเศษ</label>
                <textarea
                  className="cafe-input w-full"
                  rows={3}
                  value={formData.special_request}
                  onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={() => setEditingBooking(null)}
                className="btn-cafe-outline flex-1"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdate}
                className="btn-cafe flex-1"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
