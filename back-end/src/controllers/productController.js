import * as productService from '../services/productService.js';

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const matchProducts = async (req, res) => {
  try {
    const { productId, matchId } = req.body;
    const result = await productService.matchProducts(productId, matchId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const matches = await productService.getProductMatches(id);
    res.json(matches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
