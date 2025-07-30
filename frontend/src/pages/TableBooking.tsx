import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// จัด Model ไว้ยิง API
type Table = {
  table_id: number;
  table_number: string;
  seats: number;
  isBooked: boolean;
};

const TableBooking = () => {
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tables, setTables] = useState<Table[]>([]);

  const timeSlots = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const [numberOfPeople, setNumberOfPeople] = useState<number>();
  const [specialRequest, setSpecialRequest] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleTableClick = (tableId: number, isBooked: boolean) => {
    if (isBooked) return; // ป้องกันกดเลือกตัวที่ถูกจองไว้
    setSelectedTable(tableId);
  };

  const handleBooking = async () => {
    if (!bookingDate || !timeSlot || selectedTable === null) {
      // toast.error('Please select date, time, and table');
      return;
    }

    try {
      await axios.post(
        '/api/bookings',
        {
          bookingDate,
          bookingTime: timeSlot,
          tableId: selectedTable,
          numberOfPeople,
          specialRequest: specialRequest || null
        },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setShowSuccessModal(true);

    window.scrollTo({ top: 0, behavior: 'smooth' }); // มือถือ
    fetchTables();
      setSelectedTable(null);
    } catch (err: any) {
      // toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  // useEffect(() => {
  //   const fetchTables = async () => {
  //     try {
  //       const res = await axios.get('/api/bookings/available-tables', {
  //         params: {
  //           date: bookingDate,
  //           time: timeSlot,
  //         },
  //         withCredentials: true,
  //       });

  //       setTables(res.data);
  //     } catch (err) {
  //       console.error('Error fetching tables:', err);
  //       setTables([]);
  //     }
  //   };

  //   if (bookingDate && timeSlot) {
  //     fetchTables();
  //   } else {
  //     setTables([]); // Reset
  //   }
  // }, [bookingDate, timeSlot]);


    // เรียกโต๊ะตัวที่มีอยู่

  const fetchTables = async () => {
  try {
    const res = await axios.get('/api/bookings/available-tables', {
      params: {
        date: bookingDate,
        time: timeSlot,
      },
      withCredentials: true,
    });

    setTables(res.data);
  } catch (err) {
    console.error('Error fetching tables:', err);
    setTables([]);
  }
};

useEffect(() => {
  if (bookingDate && timeSlot) {
    fetchTables();
  } else {
    setTables([]); // Reset
  }
}, [bookingDate, timeSlot]);

  // ปิดโต๊ะที่ถูกจอง
  useEffect(() => {
    if (selectedTable !== null) {
      const selected = tables.find(t => t.table_id === selectedTable);
      if (!selected || selected.isBooked) {
        setSelectedTable(null);
      }
    }
  }, [tables]);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4 text-center">Book a Table</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Date</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Time</label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Number of People</label>
        <input
          type="number"
          min={1}
          max={12}
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Special Request (Optional)</label>
        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="e.g. Near window, birthday setup..."
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Table</label>
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table) => {
            const isSelected = selectedTable === table.table_id;
            const isBooked = table.isBooked;

            return (
              <div
                key={table.table_id}
                className={`cursor-pointer rounded-xl border p-4 text-center font-semibold shadow-sm transition
                  ${isSelected ? 'bg-green-300 border-green-600' : ''}
                  ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' : 'bg-white border-gray-300 hover:bg-green-100'}`}
                onClick={() => handleTableClick(table.table_id, isBooked)}
              >
                {table.table_number}
                {isBooked && <div className="text-xs text-red-500 mt-1">Booked</div>}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleBooking}
        className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition"
      >
        Confirm Booking
      </button>


      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">🎉 Booking Confirmed!</h2>
            <p className="mb-4">
              Your table has been booked for <strong>{bookingDate}</strong> at <strong>{timeSlot}</strong>.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default TableBooking;
