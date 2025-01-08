import axios from 'axios';
import toast from 'react-hot-toast';

// Add detailed environment variable validation
const API_KEY =import.meta.env.VITE_FINHUB_API_KEY;
const BASE_URL = import.meta.env.VITE_FINHUB_BASE_URL;

const fetchStockPrices = async symbols => {
    try {
        const promises = symbols.map(symbol =>
            axios
                .get(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`)
                .then(res => ({
                    symbol,
                    currentPrice: res.data.c,
                    change: res.data.dp,
                    previousClose: res.data.pc,
                    high: res.data.h,
                    low: res.data.l,
                    open: res.data.o,
                    volume: 1,
                }))
        );
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
      toast.error(`Error fetching stock data: ${error.message}`);
        return [];
    }
};

const getCompanyProfile = async symbol => {
    try {
        const response = await axios.get(
            `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
        );
        return response.data;
    } catch (error) {
      toast.error(`Error fetching company profile: ${error.message}`);
        return null;
    }
};

const searchStocks = async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search?q=${query}&token=${API_KEY}`);
      const data = response.data;
      if (data.result && data.result.length > 0) {
        // Filter out symbols containing dots or special chars
        const validResults = data.result.filter(stock => !stock.symbol.includes('.'));
        // Take first 5 valid results
        
        const firstFive = validResults.slice(0, 5);
        
        const stocksWithPrices = await Promise.all(
          firstFive.map(async (stock) => {
            try {
              const quote = await axios.get(`${BASE_URL}/quote?symbol=${stock.symbol}&token=${API_KEY}`);
              const profile = await axios.get(`${BASE_URL}/stock/profile2?symbol=${stock.symbol}&token=${API_KEY}`);
              return {
                name: profile.data.name || stock.description,
                ticker: stock.symbol,
                quantity: 1,
                description: stock.description, 
                buyPrice: quote.data.c || 0,
                currentPrice: quote.data.c || 0,
                sector: profile.data.finnhubIndustry || 'N/A',
                change: quote.data.dp || 0,
                previousClose: quote.data.pc || 0,
              };
            } catch (error) {
              toast.error(`Error fetching stock details for ${stock.symbol}: ${error.message}`);
              return null; // Return null for failed requests
            }
          })
        );
        // Filter out failed requests and ensure price > 0
        return stocksWithPrices.filter((s) => s && s.currentPrice > 0);
      }
      return [];
    } catch (error) {
      toast.error(`Error searching stocks: ${error.message}`);
      return [];
    }
};

export { fetchStockPrices, getCompanyProfile, searchStocks };
