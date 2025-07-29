import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function TableBooking() {
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [note, setNote] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  const tables = Array.from({ length: 10 }, (_, i) => `T${i + 1}`);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Fetch user's bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/my', { withCredentials: true });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/bookings',
        { bookingDate, timeSlot, numPeople, note },
        { withCredentials: true }
      );
      setMessage('Booking created successfully!');
      setBookingDate('');
      setTimeSlot('');
      setNumPeople(1);
      setNote('');
      fetchBookings(); // รีเฟรช List
    } catch (err) {
      console.error(err);
      setMessage('Booking failed.');
    }
  };

    const handleTableClick = (table: string) => {
    setSelectedTable(table === selectedTable ? null : table); // Toggle select
  };

  return (
        <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Select a Table to Book</h2>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {tables.map((table) => (
          <div
            key={table}
            className={`cursor-pointer rounded-xl border p-4 text-center font-semibold shadow-md 
              ${selectedTable === table ? 'bg-green-300 border-green-600' : 'bg-white border-gray-300'}`}
            onClick={() => handleTableClick(table)}
          >
            {table}
          </div>
        ))}
      </div>

      <div>
        <p>Selected Table: <strong>{selectedTable || 'None'}</strong></p>
        {/* Add form fields like date, time, people, special request below */}

     <div className="pt-20 px-4">
       {message && <p className="mb-2 text-green-600">{message}</p>}

       <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
         <div>
           <label className="block mb-1">Booking Date:</label>
           <input
             type="date"
             value={bookingDate}
             onChange={(e) => setBookingDate(e.target.value)}
             required
             className="border p-2 w-full"
           />
         </div>
         <div>
           <label className="block mb-1">Time Slot:</label>
           <input
             type="time"
             value={timeSlot}
             onChange={(e) => setTimeSlot(e.target.value)}
             required
             className="border p-2 w-full"
           />
         </div>
         <div>
           <label className="block mb-1">Number of People:</label>
           <input
             type="number"
             min={1}
             value={numPeople}
             onChange={(e) => setNumPeople(parseInt(e.target.value))}
             className="border p-2 w-full"
           />
         </div>
         <div>
           <label className="block mb-1">Note (optional):</label>
           <textarea
             value={note}
             onChange={(e) => setNote(e.target.value)}
             className="border p-2 w-full"
           />
         </div>
         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
           Book Table
         </button>
       </form>

       <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
       <ul className="space-y-3">
         {bookings.map((booking: any) => (
           <li key={booking.id} className="border p-3 rounded">
             <p><strong>Date:</strong> {booking.bookingDate}</p>
             <p><strong>Time:</strong> {booking.timeSlot}</p>
             <p><strong>People:</strong> {booking.numPeople}</p>
             <p><strong>Status:</strong> {booking.status}</p>
             {booking.note && <p><strong>Note:</strong> {booking.note}</p>}
             {/* You can add a Cancel or Edit button here */}
           </li>
         ))}
       </ul>
     </div>


      </div>
    </div>
  );
}
