import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductCreateModal from '../components/modal/ProductCreateModal';
import ProductUpdateModal from '../components/modal/ProductUpdateModal';

import Navbar from '../components/Navbar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const token = localStorage.getItem('token');

const fetchProducts = async () => {
  try {
    const res = await axios.get('/api/products');

    // Normalize product_id → id
    const normalized = res.data.map((p: any) => ({
      ...p,
      id: p.product_id ?? p.id, // fallback
    }));

    setProducts(normalized);
  } catch (err) {
    console.error('Error fetching products', err);
  } finally {
    setLoading(false);
  }
};


const deleteProduct = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;

   // or however you store it

  try {
    await axios.delete(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(products.filter(p => p.id !== id));
  } catch (err) {
    console.error('Error deleting product', err);
    alert('Failed to delete product');
  }
};


  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [role, navigate]);

  return (
    <div className="pt-20 px-6">
      {/* <h2 className="text-2xl font-bold mb-4">Manage Products</h2> */}
      <Navbar />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add Product
        </button>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={editProduct}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <ProductUpdateModal
          product={editingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onUpdated={fetchProducts}
        />
      )}

      {isCreateModalOpen && (
        <ProductCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={fetchProducts}
        />
      )}


    </div>
  );
}
