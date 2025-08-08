import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QRCode from 'react-qr-code';

import adaImg from '../assets/images/cover.jpg';

export default function Checkout() {
  const { cartId } = useParams();

  const qrData = `https://yourapp.com/pay?cart=${cartId}`;

  return (
    <div className="pt-20 bg-cafe-background min-h-screen">
      <Navbar />
      
      <section className="cafe-section">
        <div className="cafe-container flex flex-col items-center">
          <div className="cafe-card p-8 text-center max-w-md w-full fade-in">
            <h2 className="cafe-heading mb-6">🔐 สแกนเพื่อชำระเงิน</h2>
            
            <div className="relative flex justify-center mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
                <QRCode
                  value={qrData}
                  size={256}
                  bgColor="#FFFFFF"
                  fgColor="#8B4513"
                />
              </div>
              
              {/* Logo overlay */}
              <img
                src={adaImg}
                alt="logo"
                className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 border-4 border-cafe-primary"
              />
            </div>
            
            <p className="cafe-text mb-2">สแกน QR โค้ดนี้เพื่อดำเนินการชำระเงิน</p>
            <p className="cafe-text-light text-sm">หมายเลขคำสั่งซื้อ: {cartId}</p>
            
            <div className="mt-8 p-4 bg-cafe-light rounded-lg border border-cafe-secondary">
              <p className="cafe-text font-semibold mb-2">คำแนะนำการชำระเงิน</p>
              <p className="cafe-text-light text-sm text-left">
                1. เปิดแอปพลิเคชันธนาคารของคุณ<br />
                2. ใช้ฟังก์ชันสแกน QR<br />
                3. ตรวจสอบจำนวนเงินให้ถูกต้อง<br />
                4. ยืนยันการทำรายการ
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
