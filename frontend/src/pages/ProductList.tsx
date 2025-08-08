import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/Product';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/api/products').then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (product_id: number) => {
    try {
      await apiClient.post('/api/cart/add-item', {
        product_id,
        quantity: 1,
      });
      setMessage('✅ Added to cart!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage('Please log in first.');
      } else {
        const errorMessage = error.response?.data?.message || '❌ Failed to add to cart.';
        setMessage(errorMessage);
      }
    }
  };

  return (
    <div className="pt-16 bg-cafe-background min-h-screen">
      <Navbar />
      
      <section className="cafe-section">
        <div className="cafe-container">
          <h2 className="cafe-heading mb-8">รายการสินค้า</h2>
          
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 text-center fade-in">
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;

