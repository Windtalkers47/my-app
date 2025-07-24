import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticateToken, authorizeRoles('admin'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteProduct);

export default router;
