import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { fetchStockPrices, getCompanyProfile } from '../services/stockService';
import toast from 'react-hot-toast';

const TopStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    
    const fetchStockData = async () => {
      try {
        const priceData = await fetchStockPrices(popularSymbols);
        const stocksWithProfiles = await Promise.all(
          priceData.map(async (stock) => {
            const profile = await getCompanyProfile(stock.symbol);
            return {
              ...stock,
              name: profile?.name || stock.symbol,
            };
          })
        );
        setStocks(stocksWithProfiles);
      } catch (error) {
        toast.error(`Error fetching stock data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4,
        marginTop: 4,
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Popular Stocks
      </Typography>
      <Grid container spacing={3}>
        {stocks.map((stock) => (
          <Grid item xs={12} sm={6} md={3} key={stock.symbol}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{stock.symbol}</Typography>
                  {stock.change >= 0 ? 
                    <TrendingUp color="success" /> : 
                    <TrendingDown color="error" />
                  }
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {stock.name}
                </Typography>
                <Typography variant="h6">${stock.currentPrice?.toFixed(2)}</Typography>
                <Typography 
                  color={stock.change >= 0 ? 'success.main' : 'error.main'}
                >
                  {stock.change?.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TopStocks;
