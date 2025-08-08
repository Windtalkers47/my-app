import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any>({});
  const [cartId, setCartId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/api/cart')
      .then((res) => {
        setCart(res.data);
        setItems(res.data.items);
        setCartId(res.data.cart_id);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert('กรุณาเข้าสู่ระบบ');
          window.location.href = '/';
        } else {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลตะกร้าได้';
          alert(errorMessage);
        }
      });
  }, []);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    apiClient.put(`/api/cart/${cart.cart_id}/items/${itemId}`, { quantity })
      .then(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.cart_item_id === itemId ? { ...item, quantity } : item
          )
        );
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'ไม่สามารถอัปเดตจำนวนสินค้าได้';
        alert(errorMessage);
      });
  };

  const removeItem = (itemId: number) => {
    apiClient.delete(`/api/cart/${cart.cart_id}/items/${itemId}`)
      .then(() => {
        setItems((prev) => prev.filter((item) => item.cart_item_id !== itemId));
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'ไม่สามารถลบสินค้าออกจากตะกร้าได้';
        alert(errorMessage);
      });
  };

  const handleCheckout = () => {
    apiClient.post(`/api/cart/${cart.cart_id}/checkout`)
      .then(() => {
        alert('✅ Checkout complete! Generating QR...');
        navigate(`/checkout/${cart.cart_id}`); // Navigate to QR page
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'ไม่สามารถชำระเงินได้';
        alert(errorMessage);
      });
  };



  return (
    <div className="p-4">
      <Navbar />
      <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cart_item_id} className="border p-4 rounded shadow">
              <h3>🧺 {item.name}</h3>
              <p>💰 Price: {item.price} ฿</p>
              <p>📦 Total: {item.price * item.quantity} ฿</p>

              <div className="flex gap-2 items-center mt-2">
                <button
                  onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >−</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                  className="px-2 bg-gray-200 rounded"
                >＋</button>
                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  className="ml-auto bg-red-500 text-white px-3 py-1 rounded"
                >Remove</button>
              </div>
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white p-3 rounded mt-6 w-full"
          >
            {/* 💳 Checkout & Pay */}
            💳 ชำระเงิน
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
