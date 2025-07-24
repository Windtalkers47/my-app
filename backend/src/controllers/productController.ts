
import { Request, Response } from 'express';

export const getProducts = (req: Request, res: Response) => {
  res.send('Get all products');
};

export const getProductById = (req: Request, res: Response) => {
  res.send(`Get product ${req.params.id}`);
};

export const createProduct = (req: Request, res: Response) => {
  res.send('Create product');
};

export const updateProduct = (req: Request, res: Response) => {
  res.send(`Update product ${req.params.id}`);
};

export const deleteProduct = (req: Request, res: Response) => {
  res.send(`Delete product ${req.params.id}`);
};
