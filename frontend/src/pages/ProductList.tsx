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
    <div className="p-4">
      <Navbar />
      
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img src={p.image || undefined} alt={p.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">{p.price} THB</p>
            <button
              onClick={() => addToCart(p.id)}
              className="bg-yellow-500 mt-2 px-4 py-1 rounded text-white"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

