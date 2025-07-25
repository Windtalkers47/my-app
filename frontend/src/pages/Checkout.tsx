import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QRCode from 'react-qr-code';

import adaImg from '../assets/images/cover.jpg';

export default function Checkout() {
  const { cartId } = useParams();

  const qrData = `https://yourapp.com/pay?cart=${cartId}`;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🔐 Scan to Pay</h2>

        <div className="bg-white p-4 rounded-md shadow-lg">
          <QRCode
            value={qrData}
            size={256}
            bgColor="#FFFFFF"
            fgColor="#1E40AF"
          />
        </div>

                  {/* Optional Logo (put logo.png in /public or src/assets) */}
          <img
            src={adaImg}
            alt="logo"
            className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1"
          />

        <p className="mt-4 text-gray-600">Scan this QR code to complete payment.</p>
      </div>
    </div>
  );
}
