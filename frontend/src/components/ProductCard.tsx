import React from 'react';
import { Product } from '../types/Product';

interface Props {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onAddToCart?: (product_id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onAddToCart }: Props) {
  // Check if used in ProductList (has onAddToCart) or ManageProducts (has onEdit/onDelete)
  const isProductList = !!onAddToCart;
  
  return (
    <div className="cafe-card overflow-hidden fade-in">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image || 'https://placehold.co/300x200?text=No+Image'} 
          alt={product.name} 
          className="w-full h-full object-cover transition duration-500 ease-in-out transform hover:scale-110" 
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-cafe-primary mb-2">{product.name}</h3>
        <p className="cafe-text-light mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-cafe-primary">{product.price} ฿</p>
          <p className="text-cafe-text-light">📦 {product.stock}</p>
        </div>
        
        {isProductList ? (
          <button 
            onClick={() => onAddToCart && onAddToCart(product.id)}
            className="btn-cafe w-full"
          >
            เพิ่มลงตะกร้า
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit && onEdit(product)} 
              className="btn-cafe flex-1"
            >
              แก้ไข
            </button>
            <button 
              onClick={() => onDelete && onDelete(product.id)} 
              className="btn-cafe bg-red-600 hover:bg-red-700 flex-1"
            >
              ลบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
