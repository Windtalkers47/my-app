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
    <div className="pt-20">
      <Navbar />

      <section className="h-screen bg-[url('https://everydaydocuments.com/article/images/2023-how-to-find-windows-spotlight-wallpapers/2023-how-to-find-windows-spotlight-wallpapers.jpg')] bg-cover bg-center flex items-center justify-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold backdrop-blur-sm p-4 bg-black/50 rounded-xl">
          สวัสดีวันจันทร์
        </h1>
      </section>

      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6">เมนู</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {menuItems.map((item, i) => (
        <div
            key={i}
            className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition"
        >
            <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 object-cover"
            />
            <div className="p-4">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-gray-600">อุ อิ อา อุ๊ อิ อา อุ๊ เอะ</p>
            </div>
        </div>
        ))}
        </div>
      </section>


      
    </div>
  );
}
