import { useState } from 'react';
import apiClient from '../../utils/axiosConfig';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function ProductCreateModal({ onClose, onCreated }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
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
      await apiClient.post('/api/products', formData);

      onCreated();
      onClose();
      alert('เพิ่มสินค้าสำเร็จ');
    } catch (err) {
      console.error('Create product error:', err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="cafe-card p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="cafe-heading">เพิ่มสินค้าใหม่</h2>
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="กรอกชื่อสินค้า"
              required
              className="cafe-input w-full"
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">คำอธิบาย</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="กรอกรายละเอียดสินค้า"
              required
              className="cafe-input w-full min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">ราคา (บาท)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="ราคาสินค้า"
              required
              className="cafe-input w-full"
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">ลิงก์รูปภาพ (ไม่จำเป็น)</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="ลิงก์รูปภาพสินค้า"
              className="cafe-input w-full"
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">จำนวนในสต๊อก</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="จำนวนสินค้าในสต๊อก"
              required
              className="cafe-input w-full"
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
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
