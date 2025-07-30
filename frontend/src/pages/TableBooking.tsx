// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function TableBooking() {
//   const [bookingDate, setBookingDate] = useState('');
//   const [timeSlot, setTimeSlot] = useState('');
//   const [numPeople, setNumPeople] = useState(1);
//   const [note, setNote] = useState('');
//   const [bookings, setBookings] = useState([]);
//   const [message, setMessage] = useState('');

//   const tables = Array.from({ length: 10 }, (_, i) => `T${i + 1}`);
//   const [selectedTable, setSelectedTable] = useState<string | null>(null);
//   const [availableTables, setAvailableTables] = useState<number[]>([]);

//   // Fetch user's bookings
//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get('/api/bookings/my', { withCredentials: true });
//       setBookings(res.data.bookings);
//     } catch (err) {
//       console.error('Failed to load bookings:', err);
//     }
//   };

//   const fetchAvailableTables = async () => {
//   try {
//     const res = await axios.get('/api/bookings/available', {
//       params: {
//         bookingDate,
//         bookingTime: timeSlot,
//       },
//       withCredentials: true,
//     });

//     setAvailableTables(res.data.availableTables.map((table: any) => table.table_id));
//   } catch (err) {
//     console.error('Error fetching available tables:', err);
//     setAvailableTables([]); // fallback
//   }
// };

//   useEffect(() => {
//   if (bookingDate && timeSlot) {
//     fetchAvailableTables();
//   }
// }, [bookingDate, timeSlot]);


// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!selectedTable) {
//     setMessage('❌ Please select a table first.');
//     return;
//   }

//   // Extract the table number from 'T1', 'T2', ... etc.
//   const tableId = parseInt(selectedTable.replace('T', ''));

//   try {
//     const res = await axios.post(
//       '/api/bookings',
//       {
//         tableId,
//         bookingDate,
//         bookingTime: timeSlot,
//         numberOfPeople: numPeople,
//         specialRequest: note,
//       },
//       { withCredentials: true }
//     );

//     setMessage('✅ Booking created successfully!');
//     setBookingDate('');
//     setTimeSlot('');
//     setNumPeople(1);
//     setNote('');
//     setSelectedTable(null);
//     fetchBookings(); // Refresh bookings
//   } catch (err: any) {
//     console.error(err);
//     const errorMsg = err.response?.data?.error || '❌ Booking failed.';
//     setMessage(errorMsg);
//   }
// };


//     const handleTableClick = (table: string) => {
//     setSelectedTable(table === selectedTable ? null : table); // Toggle select
//   };

//   return (
//         <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Select a Table to Book</h2>

//       <div className="grid grid-cols-5 gap-4 mb-6">
//         {tables.map((table) => (
//           <div
//             key={table}
//             className={`cursor-pointer rounded-xl border p-4 text-center font-semibold shadow-md 
//               ${selectedTable === table ? 'bg-green-300 border-green-600' : 'bg-white border-gray-300'}`}
//             onClick={() => handleTableClick(table)}
//           >
//             {table}
//           </div>
//         ))}
//       </div>

//       <div>
//         <p>Selected Table: <strong>{selectedTable || 'None'}</strong></p>
//         {/* Add form fields like date, time, people, special request below */}

//      <div className="pt-20 px-4">
//        {message && <p className="mb-2 text-green-600">{message}</p>}

//        <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
//          <div>
//            <label className="block mb-1">Booking Date:</label>
//            <input
//              type="date"
//              value={bookingDate}
//              onChange={(e) => setBookingDate(e.target.value)}
//              required
//              className="border p-2 w-full"
//            />
//          </div>
//          <div>
//            <label className="block mb-1">Time Slot:</label>
//            <input
//              type="time"
//              value={timeSlot}
//              onChange={(e) => setTimeSlot(e.target.value)}
//              required
//              className="border p-2 w-full"
//            />
//          </div>
//          <div>
//            <label className="block mb-1">Number of People:</label>
//            <input
//              type="number"
//              min={1}
//              value={numPeople}
//              onChange={(e) => setNumPeople(parseInt(e.target.value))}
//              className="border p-2 w-full"
//            />
//          </div>
//          <div>
//            <label className="block mb-1">Note (optional):</label>
//            <textarea
//              value={note}
//              onChange={(e) => setNote(e.target.value)}
//              className="border p-2 w-full"
//            />
//          </div>
//          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//            Book Table
//          </button>
//        </form>

//        <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
//         <ul className="space-y-3">
//           {bookings.map((booking: any) => (
//             <li key={booking.table_booking_id} className="border p-3 rounded">
//               <p><strong>Date:</strong> {booking.booking_date}</p>
//               <p><strong>Time:</strong> {booking.booking_time}</p>
//               <p><strong>People:</strong> {booking.number_of_people}</p>
//               <p><strong>Table:</strong> T{booking.table_id}</p>
//               <p><strong>Status:</strong> {booking.status}</p>
//               {booking.special_request && <p><strong>Note:</strong> {booking.special_request}</p>}
//             </li>
//           ))}
//         </ul>
//      </div>


//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


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

  const handleTableClick = (tableId: number, isBooked: boolean) => {
    if (isBooked) return; // ป้องกันกดเลือกตัวที่ถูกจองไว้
    setSelectedTable(tableId);
  };

  const handleBooking = async () => {
    if (!bookingDate || !timeSlot || selectedTable === null) {
      toast.error('Please select date, time, and table');
      return;
    }

    try {
      await axios.post(
        '/api/bookings',
        {
          bookingDate,
          bookingTime: timeSlot,
          tableId: selectedTable,
          numberOfPeople: 2,
        },
        { withCredentials: true }
      );
      toast.success('Booking successful!');
      setSelectedTable(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  // เรียกโต๊ะตัวที่มีอยู่
  useEffect(() => {
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
    </div>
  );
};

export default TableBooking;
