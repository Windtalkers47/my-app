import { useState, useEffect } from 'react';
import apiClient from '../../utils/axiosConfig';

import { Product } from '../../types/Product';

interface Props {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ProductUpdateModal({ product, onClose, onUpdated }: Props) {
  const [formData, setFormData] = useState<Product>({
    id: product.id ?? (product as any).product_id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image,
    stock: product.stock,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put(
        `/api/products/${formData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="cafe-card p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="cafe-heading">แก้ไขสินค้า</h2>
          <button 
            className="text-2xl text-cafe-text-light hover:text-cafe-primary"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cafe-label mb-2">ชื่อสินค้า</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="กรอกชื่อสินค้า"
              className="cafe-input w-full"
              required
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">คำอธิบาย</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="กรอกรายละเอียดสินค้า"
              className="cafe-input w-full min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">ราคา (บาท)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="ราคาสินค้า"
              className="cafe-input w-full"
              required
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">ลิงก์รูปภาพ</label>
            <input
              type="text"
              name="image"
              value={formData.image ?? ''}
              onChange={handleChange}
              placeholder="ลิงก์รูปภาพสินค้า"
              className="cafe-input w-full"
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">จำนวนในสต๊อก</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="จำนวนสินค้าในสต๊อก"
              className="cafe-input w-full"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-cafe-outline px-6 py-2"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn-cafe px-6 py-2"
              disabled={loading}
            >
              {loading ? 'กำลังอัปเดต...' : 'อัปเดต'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
