import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById as getProductByIdFromDb,
  createProduct as createProductInDb,
  updateProduct as updateProductInDb,
  deleteProduct as deleteProductFromDb,
} from '../models/productModel';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductByIdFromDb(id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, stock } = req.body;

    if (!name || price === undefined || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await createProductInDb({
        name,
        price,
        description,
        image: image ?? null,
        stock: stock ?? 0,
        created_date: new Date(),
    });

    res.status(201).json({
      message: 'Product created successfully',
      insertId: (result as any).insertId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await getProductByIdFromDb(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    const { name, price, description, image, stock } = req.body;

    await updateProductInDb(id, { name, price, description, image, stock });

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await getProductByIdFromDb(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    await deleteProductFromDb(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

