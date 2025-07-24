import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from './modal/LoginModal';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn()); // ตรวจสอบสถานะตอนโหลด
  }, []);

  const toggleNav = () => setNavOpen(!navOpen);
  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);     // อัปเดตสถานะล็อกอิน
    setShowLogin(false);   // ปิด modal
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ token
    setLoggedIn(false);               // อัปเดตสถานะ
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-2xl font-bold text-brown-600">
          <Link to="/">กงสีคาเฟ่</Link>
        </div>

        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-brown-500 font-medium">Home</Link>
          <Link to="/about" className="hover:text-brown-500 font-medium">About</Link>
          <Link to="/contact" className="hover:text-brown-500 font-medium">Contact</Link>

          {!loggedIn ? (
            <button onClick={openLoginModal} className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100">Login / Register</button>
          ) : (
            <button onClick={handleLogout} className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100">Logout</button>
          )}
        </div>

        {/* Responsive */}
        <div className="md:hidden">
          <button onClick={toggleNav}>
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="md:hidden bg-white px-4 pt-4 pb-2 space-y-2">
          <Link to="/" onClick={toggleNav} className="block text-brown-600 font-medium">Home</Link>
          <Link to="/about" onClick={toggleNav} className="block text-brown-600 font-medium">About</Link>
          <Link to="/contact" onClick={toggleNav} className="block text-brown-600 font-medium">Contact</Link>

          {!loggedIn ? (
            <button onClick={() => { toggleNav(); openLoginModal(); }} className="block text-left text-sm text-blue-600 mt-2 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100">Login / Register</button>
          ) : (
            <button onClick={() => { toggleNav(); handleLogout(); }} className="block text-left text-sm text-red-600 mt-2 border border-red-600 px-3 py-1 rounded hover:bg-red-100">Logout</button>
          )}
        </div>
      )}

      {/* Modal Login */}
      {showLogin && <LoginModal onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />}
    </nav>
  );
}
