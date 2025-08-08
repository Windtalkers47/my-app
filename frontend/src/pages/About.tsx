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
    <div className="pt-20 bg-cafe-background min-h-screen">
      <Navbar />

      <section className="h-screen bg-[url('https://everydaydocuments.com/article/images/2023-how-to-find-windows-spotlight-wallpapers/2023-how-to-find-windows-spotlight-wallpapers.jpg')] bg-cover bg-center flex items-center justify-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold backdrop-blur-sm p-4 bg-black/50 rounded-xl">
          เกี่ยวกับเรา
        </h1>
      </section>

      <section className="cafe-section py-16">
        <div className="cafe-container text-center">
          <h2 className="cafe-heading mb-12">เมนูแนะนำ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="cafe-card overflow-hidden fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition duration-500 ease-in-out transform hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-cafe-primary mb-3">{item.name}</h3>
                  <p className="cafe-text-light">เครื่องดื่มรสเลิศที่คุณต้องหลงรัก</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
