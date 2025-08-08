import React from 'react';
import { Product } from '../types/Product';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-md mb-4">
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p>{product.description}</p>
      <p>💰 {product.price} ฿</p>
      <p className="text-green-600 font-bold">📦 Stock: {product.stock}</p>
      <div className="mt-2 flex gap-2">
        <button onClick={() => onEdit(product)} className="bg-blue-500 px-3 py-1 rounded text-white">Edit</button>
        <button onClick={() => onDelete(product.id)} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
      </div>
    </div>
  );
}
