import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import EditStockDialog from './EditStockDialog';
import { useState } from 'react';

const StockList = ({ stocks = [], onDelete, onEdit }) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedStock(null);
    };

    const handleEditSave = quantity => {
        onEdit(selectedStock.stockId, quantity);
    };

    if (!stocks || stocks.length === 0) {
        return <Typography>No stocks in portfolio</Typography>;
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Buy Price</TableCell>
                            <TableCell align="right">Current Price</TableCell>
                            <TableCell align="right">Total Value</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map(stock => (
                            <TableRow key={stock.stockId}>
                                <TableCell>{stock.symbol}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell align="right">
                                    {stock.quantity || 0}
                                </TableCell>
                                <TableCell align="right">
                                    ${stock.buyPrice?.toFixed(2) || 0}
                                </TableCell>
                                <TableCell align="right">
                                    ${stock.currentPrice.toFixed(2) || 0}
                                </TableCell>
                                <TableCell align="right">
                                    $
                                    {((stock.currentPrice || 0) *
                                        (stock.quantity || 0)).toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() =>
                                            onEdit(
                                                stock.stockId,
                                                stock.quantity
                                            )
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            onDelete && onDelete(stock.stockId)
                                        }
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <EditStockDialog
                open={editDialogOpen}
                onClose={handleEditClose}
                stock={selectedStock}
                onSave={handleEditSave}
            />
        </>
    );
};

export default StockList;
