import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
const EditStockDialog = ({ open, onClose, stock, onSave }) => {
    const [quantity, setQuantity] = useState(stock?.quantity || 1);

    const handleSave = () => {
        if(quantity <= 0) {
            toast.error('Quantity must be greater than 0');
            return;
        }
        onSave(stock.stockId, quantity);
        onClose();
    };

    // Reset quantity when dialog opens with new stock
    useEffect(() => {
        setQuantity(stock?.quantity || 1);
    }, [stock]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Stock Quantity</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={quantity}
                    c
                    onChange={e => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                            setQuantity(value);
                        }
                    }}
                    slotProps={{
                        input: {
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            min: 1,
                        },
                    }}
                    helperText="Enter number of shares"
                    error={quantity < 0}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditStockDialog;
