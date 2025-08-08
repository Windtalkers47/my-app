import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';
import ProductCreateModal from '../components/modal/ProductCreateModal';
import ProductUpdateModal from '../components/modal/ProductUpdateModal';

import Navbar from '../components/Navbar';

import { Product } from '../types/Product';

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/api/products');
      setProducts(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('กรุณาเข้าสู่ระบบ');
        window.location.href = '/';
      } else if (err.response?.status === 403) {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = '/';
      } else {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลสินค้าได้';
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    try {
      await apiClient.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      alert('ลบสินค้าสำเร็จ');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'ไม่สามารถลบสินค้าได้';
      alert(errorMessage);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // Role checking is handled by ProtectedRoute component, so we don't need to check it here

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
              onEdit={handleEditProduct}
              onDelete={handleDelete}
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
