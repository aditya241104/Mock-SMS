import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();

const PORT = process.env.PORT ;
app.use(express.json());
// CORS config
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});