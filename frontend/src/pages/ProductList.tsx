// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const ProductList = () => {
//   const [products, setProducts] = useState<any[]>([]);

//   useEffect(() => {
//     axios.get('/api/products').then((res) => setProducts(res.data));
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Products</h2>
//       <div className="grid grid-cols-2 gap-4">
//         {products.map((p) => (
//           <div key={p.id} className="border p-4 rounded shadow">
//             <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
//             <h3 className="font-semibold">{p.name}</h3>
//             <p>{p.description}</p>
//             <p className="text-green-600 font-bold">{p.price} THB</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;


import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/products').then((res) => setProducts(res.data));
  }, []);

const handleAddToCart = async (productId: number) => {
  const user_id = localStorage.getItem('user_id');
  if (!user_id) return setMessage('Please log in first.');

  try {
    await axios.post('/api/cart/add-item', {
      user_id: parseInt(user_id),
      product_id: productId,
      quantity: 1,
    });

    setMessage('✅ Added to cart!');
    setTimeout(() => setMessage(null), 2000);
  } catch (err) {
    console.error(err);
    setMessage('❌ Failed to add to cart.');
  }
};


  return (
    <div className="p-4">
      <Navbar />
      
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.product_id} className="border p-4 rounded shadow">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">{p.price} THB</p>
            <button
              onClick={() => handleAddToCart(p.product_id)}
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

