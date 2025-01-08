import express from 'express';
import {
    addStock,
    updateStock,
    deleteStock,
    getPortfolioStats,
    getStocks,
} from '../controllers/stockController.js';

const router = express.Router();

router.get('/my', getStocks);
router.post('/addstock', addStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);
router.get('/stats', getPortfolioStats);

export default router;
