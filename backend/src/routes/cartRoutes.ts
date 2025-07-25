import express from 'express';
import {
  createCart,
  addItemToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  checkoutCart
} from '../controllers/cartController';

const router = express.Router();

router.post('/', createCart);
router.post('/:cartId/items', addItemToCart);
router.get('/:userId', getCartByUserId);
router.put('/:cartId/items/:itemId', updateCartItem);
router.delete('/:cartId/items/:itemId', deleteCartItem);
router.post('/:cartId/checkout', checkoutCart);

export default router;
