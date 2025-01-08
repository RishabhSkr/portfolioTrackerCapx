import Stock from '../models/Stock.js';
import { ApiError } from '../middleware/errorHandler.js';

const getStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find();

        if(!stocks) throw new ApiError(404, 'No stocks found,Try adding some');
        res.json({ success: true, data: stocks });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
}

const addStock = async (req, res, next) => {
    try {

        if (!req.body.ticker) {
            return res.status(400).json({
                success: false,
                message: 'Stock ticker is required'
            });
        }

        // Clean and standardize the ticker
        const incomingTicker = req.body.ticker.toString().trim().toUpperCase();

        // Case insensitive search using regex
        const existingStock = await Stock.findOne({
            ticker: { $regex: new RegExp(`^${incomingTicker}$`, 'i') }
        });
        
        if (existingStock) {
            return res.status(400).json({ 
                success: false, 
                message: `Stock ${incomingTicker} already exists in your portfolio with ID: ${existingStock._id}`,
                existingStock: existingStock
            });
        }

        const stockData = {
            ...req.body,
            ticker: incomingTicker,
            quantity: 1,
            currentPrice: Number(req.body.currentPrice) || 0,
            buyPrice: Number(req.body.buyPrice) || 0
        };

        const stock = await Stock.create(stockData);

        res.status(201).json({ 
            success: true, 
            data: stock,
            message: `Stock ${incomingTicker} added successfully to your portfolio`
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const stock = await Stock.findById(id);
        if (!stock) {
            throw new ApiError(404, 'Stock not found');
        }

        stock.quantity = quantity;
        await stock.save();
        
        res.json({ success: true, data: stock });
    } catch (error) {
        next(error);
    }
};

const deleteStock = async (req, res, next) => {
    try {
        const stock = await Stock.findByIdAndDelete(req.params.id);
        if (!stock) throw new ApiError(404, 'Stock not found');
        res.json({ success: true, data: {} });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

const getPortfolioStats = async (req, res, next) => {
    try {
        const stocks = await Stock.find();
        
        const portfolioValue = stocks.reduce(
            (total, stock) => total + (stock.quantity * stock.currentPrice),0
        );
        const countTotalStocks = stocks.reduce(
            (total, stock) => total + stock.quantity,0
        );
        const holdings = stocks.map(stock => ({
            stockId: stock._id,
            symbol: stock.ticker,
            name: stock.name,
            quantity: stock.quantity,
            currentPrice: stock.currentPrice,
            buyPrice: stock.buyPrice,
            value: stock.quantity * stock.currentPrice,
            percentage: 0,
           
        }));

        holdings.forEach(holding => {
            holding.percentage = (holding.value / portfolioValue) * 100;
        });

        // Find top performer based on holding value
        const topPerformer = holdings.reduce(
            (prev, current) => (prev.value > current.value ? prev : current), 
            holdings[0]
        );

        res.json({
            success: true,
            data: {
                totalValue: portfolioValue,
                totalStocks: countTotalStocks,
                topPerformer,
                holdings,
            }
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

export {
    getStocks,
    addStock,
    updateStock,
    deleteStock,
    getPortfolioStats
};
