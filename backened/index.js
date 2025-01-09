import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import stockRoutes from './routes/stockRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173',"https://portfolio-tracker-capx.vercel.app", process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));


mongoose
.connect(process.env.MONGODB_URI, { dbName: 'StockFolio' })
.then(data => {
    console.log(
        'Database connected:',
        data.connection.name
    );
})
.catch(err => {
    console.log('Error connecting to database:', err);
});

app.get('/', (req, res) => {
    res.send('Welcome to the stock portfolio API');
});

app.use('/api/stocks', stockRoutes);

// Error handling middleware
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
