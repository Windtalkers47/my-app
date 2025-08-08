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
    <div className="pt-20 bg-cafe-background min-h-screen">
      <Navbar />

      <section className="cafe-section">
        <div className="cafe-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="cafe-heading">จัดการสินค้า</h2>
            <button
              className="btn-cafe flex items-center"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <span className="mr-2">+</span> เพิ่มสินค้า
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="cafe-card p-12 text-center">
              <h3 className="cafe-subheading mb-4">ยังไม่มีสินค้า</h3>
              <p className="cafe-text-light mb-6">เริ่มต้นด้วยการเพิ่มสินค้าชิ้นแรกของคุณ</p>
              <button
                className="btn-cafe"
                onClick={() => setIsCreateModalOpen(true)}
              >
                เพิ่มสินค้า
              </button>
            </div>
          )}
        </div>
      </section>

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
