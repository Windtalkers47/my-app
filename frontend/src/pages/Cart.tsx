import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const [items, setItems] = useState<any[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    axios.get(`/api/cart/${user_id}`)
      .then((res) => {
        setItems(res.data.items);
        setCartId(res.data.cart.cart_id);
      })
      .catch((err) => console.error('Error loading cart:', err));
  }, []);

  const updateQuantity = (itemId: number, quantity: number) => {
    if (!cartId) return;
    axios.put(`/api/cart/${cartId}/items/${itemId}`, { quantity })
      .then(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.cart_item_id === itemId ? { ...item, quantity } : item
          )
        );
      });
  };

  const removeItem = (itemId: number) => {
    if (!cartId) return;
    axios.delete(`/api/cart/${cartId}/items/${itemId}`).then(() => {
      setItems((prev) => prev.filter((item) => item.cart_item_id !== itemId));
    });
  };

const handleCheckout = () => {
  if (!cartId) return;
  axios.post(`/api/cart/${cartId}/checkout`)
    .then(() => {
      alert('✅ Checkout complete! Generating QR...');
      navigate(`/checkout/${cartId}`); // Navigate to QR page
    })
    .catch((err) => console.error('Checkout failed:', err));
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
                  onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >−</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
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
