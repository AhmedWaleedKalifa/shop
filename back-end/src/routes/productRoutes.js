import express from 'express';
import { createProduct, matchProducts, getProductMatches } from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.post('/match', matchProducts);
router.get('/:id/matches', getProductMatches);

export default router;
