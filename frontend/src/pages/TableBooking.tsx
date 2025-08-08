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
    <div className="pt-16 bg-cafe-background min-h-screen">
      <Navbar />
      
      <section className="cafe-section">
        <div className="cafe-container max-w-4xl">
          <h2 className="cafe-heading mb-8">📅 จองโต๊ะร้านอาหาร</h2>
          
          <div className="cafe-card p-6 mb-8 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="cafe-label mb-2">เลือกวันที่</label>
                <input
                  type="date"
                  className="cafe-input w-full"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="cafe-label mb-2">เลือกเวลา</label>
                <select
                  className="cafe-input w-full"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="">-- เลือกเวลา --</option>
                  <option value="18:00-20:00">18:00 - 20:00</option>
                  <option value="20:00-22:00">20:00 - 22:00</option>
                  <option value="22:00-00:00">22:00 - 00:00</option>
                </select>
              </div>
              
              <div>
                <label className="cafe-label mb-2">จำนวนคน</label>
                <input
                  type="number"
                  className="cafe-input w-full"
                  value={numberOfPeople || ''}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              
              <div>
                <label className="cafe-label mb-2">คำขอพิเศษ</label>
                <textarea
                  rows={2}
                  className="cafe-input w-full"
                  placeholder="เช่น ขอใกล้หน้าต่าง หรือ ขอเก้าอี้เสริมสำหรับเด็ก"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="cafe-card p-6 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="cafe-subheading mb-6">เลือกโต๊ะ</h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableTables.length === 0 ? (
                  <p className="col-span-full cafe-text text-center py-8">ไม่มีโต๊ะว่างในช่วงเวลานี้</p>
                ) : (
                  availableTables.map((table) => (
                    <button
                      key={table.table_id}
                      onClick={() => !table.isBooked && setSelectedTableId(table.table_id)}
                      disabled={table.isBooked}
                      className={`p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                        table.isBooked
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                          : selectedTableId === table.table_id
                            ? 'bg-cafe-primary text-cafe-light shadow-lg'
                            : 'bg-cafe-light hover:bg-cafe-secondary border border-cafe-secondary'
                      }`}
                    >
                      <div className="font-bold">โต๊ะ {table.table_number}</div>
                      <div className="text-sm mt-1">{table.seats} ที่นั่ง</div>
                      {table.isBooked && <div className="text-xs mt-1">ถูกจองแล้ว</div>}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <button
              onClick={handleBooking}
              disabled={loading}
              className={`btn-cafe w-full py-3 text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังจอง...
                </div>
              ) : (
                'ยืนยันการจองโต๊ะ'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
          <div className="cafe-card p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="cafe-heading mb-4">จองสำเร็จ!</h3>
            <p className="cafe-text mb-6">ขอบคุณที่ใช้บริการ เราหวังว่าจะได้พบคุณเร็วๆ นี้</p>
            <button
              className="btn-cafe w-full"
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
