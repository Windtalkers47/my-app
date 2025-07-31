import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import TableBooking from './pages/TableBooking';
import ManageProducts from './pages/ManageProducts';

import ProtectedRoute from './components/ProtectedRoute';
import ProductList from './pages/ProductList';
import Checkout from './pages/Checkout';
import { Toaster } from 'react-hot-toast';
import MyBooking from './components/MyBookings';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<ProductList />} />

        {/* Admin Only */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />

        {/* Shared Admin + Customer */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['admin', 'customer']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table-booking"
          element={
            <ProtectedRoute allowedRoles={['admin', 'customer']}>
              <TableBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-booking"
          element={
            <ProtectedRoute allowedRoles={['admin', 'customer']}>
              <MyBooking />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/:cartId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'customer']}>
              <Checkout />
            </ProtectedRoute>
        }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
