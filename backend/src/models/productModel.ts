import db from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
  product_id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
  created_date: Date;
}

export const getAllProducts = async (): Promise<ProductRow[]> => {
  const [rows] = await db.execute('SELECT * FROM products');
  return rows as ProductRow[];
};

export const getProductById = async (id: number): Promise<ProductRow | null> => {
  const [rows] = await db.execute('SELECT * FROM products WHERE product_id = ?', [id]);
  const result = rows as ProductRow[];
  return result.length ? result[0] : null;
};

export const createProduct = async (product: {
  name: string;
  price: number;
  description: string;
  image?: string | null;
  stock?: number | null;
  created_date: Date;
}) => {
  const sql = `
    INSERT INTO products (name, price, description, image, stock, created_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    product.name,
    product.price,
    product.description,
    product.image ?? null,
    product.stock ?? 0,
    product.created_date,
  ]);

  return result;
};

export const updateProduct = async (
  product_id: number,
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  }
) => {
  const [result] = await db.execute(
    `UPDATE products
     SET name = ?, description = ?, price = ?, image = ?, stock = ?
     WHERE product_id = ?`,
    [product.name, product.description, product.price, product.image, product.stock, product_id]
  );
  return result;
};


export const deleteProduct = async (id: number) => {
  const [result] = await db.execute(
    'DELETE FROM products WHERE product_id = ?',
    [id]
  );
  return result;
};

