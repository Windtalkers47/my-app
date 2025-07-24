import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">{p.price} THB</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
