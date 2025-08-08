import Navbar from '../components/Navbar';

import latteImg from '../assets/images/DSC09498-Enhanced-NR-1-1-1024x683.jpg';
import cappuccinoImg from '../assets/images/panda_diplomacy_china_expenses_SPACEBAR_Hero_b5dbb20c49.webp';
import matchaImg from '../assets/images/Taurineforcat-1536x1022.jpg';

const menuItems = [
  { name: 'ไลอ้อนคิงง', image: latteImg },
  { name: 'เจ้าแพนด้า', image: cappuccinoImg },
  { name: 'เสือน้อย', image: matchaImg },
];

export default function About() {

  return (
    <div className="pt-16 bg-cafe-background min-h-screen">
      <Navbar />

      <section className="h-screen bg-[url('https://everydaydocuments.com/article/images/2023-how-to-find-windows-spotlight-wallpapers/2023-how-to-find-windows-spotlight-wallpapers.jpg')] bg-cover bg-center flex items-center justify-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold backdrop-blur-sm p-4 bg-black/50 rounded-xl">
          ติดต่อเรา
        </h1>
      </section>

      <section className="cafe-section py-16">
        <div className="cafe-container">
          <div className="cafe-card p-8 max-w-4xl mx-auto fade-in">
            <h2 className="cafe-heading mb-8 text-center">ข้อมูลการติดต่อ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start">
                <div className="text-2xl mr-4 text-cafe-primary">📍</div>
                <div>
                  <h3 className="cafe-subheading mb-2">ที่อยู่</h3>
                  <p className="cafe-text">123 ถนนกาแฟหอม<br />แขวง สุขุมวิท<br />เขตคลองเตย กรุงเทพฯ 10110</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4 text-cafe-primary">📞</div>
                <div>
                  <h3 className="cafe-subheading mb-2">โทรศัพท์</h3>
                  <p className="cafe-text">02-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4 text-cafe-primary">✉️</div>
                <div>
                  <h3 className="cafe-subheading mb-2">อีเมล</h3>
                  <p className="cafe-text">info@cafeapp.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4 text-cafe-primary">🕒</div>
                <div>
                  <h3 className="cafe-subheading mb-2">เวลาเปิด-ปิด</h3>
                  <p className="cafe-text">จันทร์-ศุกร์: 07:00-20:00<br />เสาร์-อาทิตย์: 08:00-22:00</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="cafe-subheading mb-4">ติดตามเรา</h3>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-3xl hover:text-cafe-primary transition-colors">📘</a>
                <a href="#" className="text-3xl hover:text-cafe-primary transition-colors">📷</a>
                <a href="#" className="text-3xl hover:text-cafe-primary transition-colors">🐦</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
