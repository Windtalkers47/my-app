// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// type Table = {
//   table_id: number;
//   table_number: string;
//   seats: number;
//   isBooked: boolean;
// };

// const TableBooking = () => {
//   const [bookingDate, setBookingDate] = useState('');
//   const [timeSlot, setTimeSlot] = useState('');
//   const [selectedTable, setSelectedTable] = useState<number | null>(null);
//   const [tables, setTables] = useState<Table[]>([]);

//   const timeSlots = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
//   const [numberOfPeople, setNumberOfPeople] = useState<number>();
//   const [specialRequest, setSpecialRequest] = useState('');
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem('token');

//   const handleTableClick = (tableId: number, isBooked: boolean) => {
//     if (isBooked) return;
//     setSelectedTable(tableId);
//   };

//   const handleBooking = async () => {
//     if (!bookingDate || !timeSlot || selectedTable === null) {
//       toast.error('Please select date, time, and table');
//       return;
//     }

//     if (!numberOfPeople || numberOfPeople < 1) {
//       toast.error('Please enter number of people');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         '/api/bookings',
//         {
//           bookingDate,
//           bookingTime: timeSlot,
//           tableId: selectedTable,
//           numberOfPeople,
//           specialRequest: specialRequest || null,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success('Successfully booked!');
//       // setShowSuccessModal(true);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       fetchTables();
//       setSelectedTable(null);
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || 'Booking failed');
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   useEffect(() => {
//     if (bookingDate && timeSlot) {
//       fetchTables();
//     } else {
//       setTables([]);
//     }
//   }, [bookingDate, timeSlot]);

//   useEffect(() => {
//     if (selectedTable !== null) {
//       const selected = tables.find(t => t.table_id === selectedTable);
//       if (!selected || selected.isBooked) {
//         setSelectedTable(null);
//       }
//     }
//   }, [tables]);

//   return (
//     <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">Book a Table</h2>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Select Date</label>
//         <input
//           type="date"
//           value={bookingDate}
//           onChange={(e) => setBookingDate(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Select Time</label>
//         <select
//           value={timeSlot}
//           onChange={(e) => setTimeSlot(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         >
//           <option value="">Select Time</option>
//           {timeSlots.map((slot) => (
//             <option key={slot} value={slot}>
//               {slot}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Number of People</label>
//         <input
//           type="number"
//           min={1}
//           max={12}
//           value={numberOfPeople}
//           onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Special Request (Optional)</label>
//         <textarea
//           value={specialRequest}
//           onChange={(e) => setSpecialRequest(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md"
//           placeholder="e.g. Near window, birthday setup..."
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Select Table</label>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {tables.map((table) => {
//             const isSelected = selectedTable === table.table_id;
//             const isBooked = table.isBooked;

//             return (
//               <div
//                 key={table.table_id}
//                 className={`cursor-pointer rounded-xl border p-4 text-center font-semibold shadow-sm transition
//                   ${isSelected ? 'bg-green-300 border-green-600' : ''}
//                   ${isBooked
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
//                     : 'bg-white border-gray-300 hover:bg-green-100'}`}
//                 onClick={() => handleTableClick(table.table_id, isBooked)}
//               >
//                 {table.table_number}
//                 {isBooked && <div className="text-xs text-red-500 mt-1">Booked</div>}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <button
//         onClick={handleBooking}
//         disabled={loading}
//         className={`w-full text-white py-2 rounded-lg mt-4 transition
//           ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
//       >
//         {loading ? 'Booking...' : 'Confirm Booking'}
//       </button>

//       {showSuccessModal && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold mb-2">🎉 Booking Confirmed!</h2>
//             <p className="mb-4">
//               Your table has been booked for <strong>{bookingDate}</strong> at <strong>{timeSlot}</strong>.
//             </p>
//             <button
//               onClick={() => setShowSuccessModal(false)}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TableBooking;


import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type Table = {
  table_id: number;
  table_number: string;
  seats: number;
  isBooked: boolean;
};

const TableBooking = () => {

  const token = localStorage.getItem('token');

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
      const res = await axios.get('/api/bookings/available-tables', {
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
      await axios.post(
        '/api/bookings',
        {
          bookingDate,
          bookingTime: timeSlot.split('-')[0],
          tableId: selectedTableId,
          numberOfPeople: numberOfPeople,
          specialRequest: specialRequest || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Booking successful!');
      setShowSuccessModal(true); // Optional: You can enable this for a modal popup

      setSelectedTableId(null);
      setNumberOfPeople(undefined);

      fetchAvailableTables(); // Refresh availability
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
          <option value="20:00-22:00">22:00 - 00:00</option>
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
