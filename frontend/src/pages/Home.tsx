import Navbar from '../components/Navbar';

import latteImg from '../assets/images/DSC09498-Enhanced-NR-1-1-1024x683.jpg';
import cappuccinoImg from '../assets/images/panda_diplomacy_china_expenses_SPACEBAR_Hero_b5dbb20c49.webp';
import matchaImg from '../assets/images/Taurineforcat-1536x1022.jpg';

const menuItems = [
  { name: 'ไลอ้อนคิงง', image: latteImg },
  { name: 'เจ้าแพนด้า', image: cappuccinoImg },
  { name: 'เสือน้อย', image: matchaImg },
];

export default function Home() {

  return (
    <div className="pt-16 bg-cafe-background">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen bg-[url('https://everydaydocuments.com/article/images/2023-how-to-find-windows-spotlight-wallpapers/2023-how-to-find-windows-spotlight-wallpapers.jpg')] bg-cover bg-center flex items-center justify-center relative">
        <div className="absolute inset-0 bg-cafe-primary bg-opacity-70"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 fade-in">
            ยินดีต้อนรับสู่ กงสีคาเฟ่
          </h1>
          <p className="text-cafe-light text-xl md:text-2xl mb-8 max-w-2xl mx-auto fade-in">
            สถานที่ที่คุณสามารถผ่อนคลายและเพลิดเพลินกับเครื่องดื่มรสเลิศ
          </p>
          <div className="fade-in" style={{ animationDelay: '0.3s' }}>
            <button 
              className="btn-cafe text-lg px-8 py-3"
              onClick={() => window.location.href = '/products'}
            >
              ดูเมนูของเรา
            </button>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="cafe-section py-16 bg-cafe-background">
        <div className="cafe-container max-w-6xl">
          <h2 className="cafe-heading text-center mb-12">เมนูแนะนำ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="cafe-card fade-in overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition duration-700 ease-in-out transform hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="cafe-subheading mb-3">{item.name}</h3>
                  <p className="cafe-text-light mb-5">เครื่องดื่มรสเลิศที่คุณต้องหลงรัก</p>
                  <button 
                    className="btn-cafe w-full"
                    onClick={() => window.location.href = '/products'}
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="cafe-section py-16 bg-cafe-secondary bg-opacity-10">
        <div className="cafe-container max-w-6xl">
          <h2 className="cafe-heading text-center mb-12">ทำไมต้องเลือกเรา?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cafe-card p-8 text-center fade-in">
              <div className="text-5xl mb-4">☕</div>
              <h3 className="cafe-subheading mb-3">วัตถุดิบคุณภาพ</h3>
              <p className="cafe-text">เราใช้วัตถุดิบที่คัดสรรมาอย่างดีจากแหล่งที่เชื่อถือได้</p>
            </div>
            <div className="cafe-card p-8 text-center fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="cafe-subheading mb-3">บรรยากาศผ่อนคลาย</h3>
              <p className="cafe-text">พื้นที่ที่ออกแบบมาเพื่อให้คุณรู้สึกผ่อนคลายและสะดวกสบาย</p>
            </div>
            <div className="cafe-card p-8 text-center fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="cafe-subheading mb-3">บาริสต้ามืออาชีพ</h3>
              <p className="cafe-text">ทีมงานที่ผ่านการฝึกอบรมอย่างมืออาชีพพร้อมเสิร์ฟ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
