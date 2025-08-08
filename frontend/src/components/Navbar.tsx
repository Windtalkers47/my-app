import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from './modal/LoginModal'
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';
import apiClient from '../utils/axiosConfig';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

useEffect(() => {
  const checkAuth = async () => {
    try {
      setLoading(true);
      const isLogged = await isLoggedIn();
      const userRole = await getUserRole();
      setLoggedIn(isLogged);
      setRole(userRole);
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoggedIn(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth(); // เช็คครั้งแรกตอน mount

  // ฟัง event การเปลี่ยน auth state
  const handleAuthChange = () => {
    checkAuth();
  };

    window.addEventListener('authChange', handleAuthChange);

  return () => {
    window.removeEventListener('authChange', handleAuthChange);
  };
}, []);

  const toggleNav = () => setNavOpen(!navOpen);
  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

const handleLoginSuccess = (role: string) => {
  setLoggedIn(true);
  setRole(role);       // เก็บ role จาก LoginModal โดยตรง
  setShowLogin(false); // ปิด modal
};

  const handleLogout = async () => {
    // Clear auth state immediately to prevent race conditions
    setLoggedIn(false);
    setRole(null);
    
    try {
      const response = await apiClient.post('/api/logout');
      if (response.status === 200) {
        // Already cleared state above
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Already cleared state above
      navigate('/');
    }
  };

const renderLinks = () => {
  const secondaryLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  if (!loggedIn) {
    return [
      { to: '/', label: 'Home' },
      ...secondaryLinks
    ];
  }

  if (role === 'admin') {
    return [
      { to: '/', label: 'Home' },
      { to: '/admin-dashboard', label: 'Admin Dashboard' },
      { to: '/manage-products', label: 'Manage Products' },
      { to: '/products', label: 'Products' },
      { to: '/cart', label: 'Cart' },
      { to: '/table-booking', label: 'Table Booking' },
      { to: '/my-booking', label: 'My Booking' },
      ...secondaryLinks
    ];
  }

  if (role === 'customer') {
    return [
      { to: '/', label: 'Home' },
      { to: '/products', label: 'Products' },
      { to: '/cart', label: 'Cart' },
      { to: '/table-booking', label: 'Table Booking' },
      { to: '/my-booking', label: 'My Booking' },
      ...secondaryLinks
    ];
  }

  return [
    { to: '/', label: 'Home' },
    ...secondaryLinks
  ];
};

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-2xl font-bold text-brown-600">
          <Link to="/">กงสีคาเฟ่</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {renderLinks().map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="hover:text-brown-500 font-medium"
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <div className="w-24 h-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          ) : !loggedIn ? (
            <button
              onClick={openLoginModal}
              className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleNav}>
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="md:hidden bg-white px-4 pt-4 pb-2 space-y-2">
          {renderLinks().map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={toggleNav}
              className="block text-brown-600 font-medium"
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <div className="w-24 h-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          ) : !loggedIn ? (
            <button
              onClick={() => {
                toggleNav();
                openLoginModal();
              }}
              className="block text-left text-sm text-blue-600 mt-2 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => {
                toggleNav();
                handleLogout();
              }}
              className="block text-left text-sm text-red-600 mt-2 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}


{/* ปุ่มจองด้านข้าง */}
{/* <Link to="/table-booking" className="text-white px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
  Book a Table
</Link> */}



    </nav>
  );
}