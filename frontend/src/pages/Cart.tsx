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
    <div className="pt-16 bg-cafe-background min-h-screen">
      <Navbar />
      
      <section className="cafe-section">
        <div className="cafe-container">
          <h2 className="cafe-heading mb-8">🛒 ตะกร้าของคุณ</h2>
          
          {items.length === 0 ? (
            <div className="cafe-card p-12 text-center">
              <h3 className="cafe-subheading mb-4">ตะกร้าของคุณว่างเปล่า</h3>
              <p className="cafe-text-light mb-6">เพิ่มสินค้าที่คุณชื่นชอบลงในตะกร้า</p>
              <button
                className="btn-cafe"
                onClick={() => navigate('/products')}
              >
                ดูสินค้า
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.cart_item_id} className="cafe-card p-6 fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-cafe-primary mb-2">🧺 {item.name}</h3>
                      <p className="cafe-text mb-1">💰 ราคา: {item.price} ฿</p>
                      <p className="cafe-text font-semibold">📦 รวม: {item.price * item.quantity} ฿</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="btn-cafe-outline w-8 h-8 flex items-center justify-center p-0"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="cafe-text font-semibold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="btn-cafe-outline w-8 h-8 flex items-center justify-center p-0"
                        >
                          ＋
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.cart_item_id)}
                        className="btn-cafe bg-red-600 hover:bg-red-700 whitespace-nowrap"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="cafe-card p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-cafe-primary">ยอดรวม</h3>
                  <p className="text-2xl font-bold text-cafe-primary">
                    {items.reduce((total, item) => total + (item.price * item.quantity), 0)} ฿
                  </p>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="btn-cafe w-full py-4 text-lg"
                >
                  💳 ชำระเงิน
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
