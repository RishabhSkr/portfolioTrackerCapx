import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { searchStocks } from '../services/stockService';
import axios from 'axios';
import { BASE_URL,} from '../../constants';
import { toast } from 'react-hot-toast';

const SearchStocks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError('');
        try {
            const searchResults = await searchStocks(searchTerm);
            setResults(searchResults);
            if (searchResults.length === 0) {
                setError('No stocks found matching your search.');
            }
        } catch (error) {
            setError('Error searching stocks. Please try again.');
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleAddStockToPortofolio = stockData => {
      axios.post(
          `${BASE_URL}/addstock`,
          stockData,
          {
            headers: {
                'Content-Type': 'application/json'
            }
        }
      )
      .then(res => {
          toast.success(`Successfully added ${stockData.ticker} to portfolio!`);
          // Remove the added stock from results to prevent duplicate additions
          setResults(prev => prev.filter(stock => stock.ticker !== stockData.ticker));
          return res.data;
      })
      .catch(error => {
          toast.error(error.response?.data?.message || 'Something went wrong');
      });
  };

    return (
        <Paper sx={{ p: 4, mt: 4 }} elevation={3}>
            <Typography variant="h5" gutterBottom>
                Search Stocks
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    fullWidth
                    label="Enter stock symbol or company name"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <SearchIcon />
                        )
                    }
                >
                    Search
                </Button>
            </Box>

            {error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {results.length > 0 && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Sector</TableCell>
                                <TableCell>Current Price</TableCell>
                                <TableCell>Change</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map(stock => (
                                <TableRow key={stock.ticker}>
                                    <TableCell>{stock.ticker}</TableCell>
                                    <TableCell>{stock.name}</TableCell>
                                    <TableCell>{stock.sector}</TableCell>
                                    <TableCell>
                                        ${stock.currentPrice || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            color={
                                                stock.change >= 0
                                                    ? 'success.main'
                                                    : 'error.main'
                                            }
                                        >
                                            {stock.change}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() =>
                                                handleAddStockToPortofolio(
                                                    stock
                                                )
                                            } // Pass the specific stock
                                        >
                                            Add to Portfolio
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default SearchStocks;
