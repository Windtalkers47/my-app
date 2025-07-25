import { Request, Response } from 'express';
import db from '../utils/db';

// POST /api/cart สร้างตระกร้า
export const createCart = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND status = "active"', [user_id]);
    if ((existing as any).length > 0) {
      return res.status(400).json({ message: 'User already has an active cart' });
    }
    const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [user_id]);
    res.status(201).json({ cartId: (result as any).insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create cart', error: err });
  }
};

// POST /api/cart/:cartId/items เพิ่มสินค้าลงตระกร้า
export const addItemToCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { product_id, quantity, price } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [cartId, product_id, quantity, price]
    );
    res.status(201).json({ itemId: (result as any).insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item to cart', error: err });
  }
};

// GET /api/cart/:userId ดึงตะกร้าของผู้ใช้
export const getCartByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [cartRows] = await db.query('SELECT * FROM cart WHERE user_id = ? AND status = "active"', [userId]);
    if ((cartRows as any).length === 0) return res.status(404).json({ message: 'Cart not found' });

    const cart = (cartRows as any)[0];
    const [items] = await db.query('SELECT * FROM cart_items WHERE cart_id = ?', [cart.cart_id]);

    res.json({ cart, items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart', error: err });
  }
};

// PUT /api/cart/:cartId/items/:itemId อัปเดตจำนวนสินค้าในตะกร้า
export const updateCartItem = async (req: Request, res: Response) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    await db.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND cart_item_id = ?', [
      quantity,
      cartId,
      itemId,
    ]);
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err });
  }
};

// DELETE /api/cart/:cartId/items/:itemId ลบสินค้าออกจากตะกร้า
export const deleteCartItem = async (req: Request, res: Response) => {
  const { cartId, itemId } = req.params;
  try {
    await db.query('DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?', [cartId, itemId]);
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete cart item', error: err });
  }
};

// POST /api/cart/:cartId/checkout ทำการชำระเงิน (รวมกับ QR Payment)
export const checkoutCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  try {
    await db.query('UPDATE cart SET status = "checked_out" WHERE cart_id = ?', [cartId]);
    res.json({ message: 'Checkout complete (You can now generate QR)' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to checkout', error: err });
  }
};


// POST /api/cart/add-item → ใช้ user_id เพื่อเพิ่มสินค้าลงตะกร้า
export const addItemToUserCart = async (req: Request, res: Response) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // 1. Check or create active cart
    const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND status = "active"', [user_id]);
    let cartId;

    if ((existing as any).length > 0) {
      cartId = (existing as any)[0].cart_id;
    } else {
      const [createResult] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [user_id]);
      cartId = (createResult as any).insertId;
    }

    // 2. Get product price
    const [productRows] = await db.query('SELECT price FROM products WHERE product_id = ?', [product_id]);
    if ((productRows as any).length === 0) return res.status(404).json({ message: 'Product not found' });

    const price = (productRows as any)[0].price;

    // 3. Add item
    await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [cartId, product_id, quantity, price, quantity]
    );

    res.json({ message: 'Item added to cart', cartId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item', error: err });
  }
};
