import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    ticker: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    buyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    sector: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Stock', stockSchema);