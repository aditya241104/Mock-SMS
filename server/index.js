import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './Routes/authRoutes.js';
import apiKeyRoutes from './Routes/apiKeyRoutes.js';
import projectsRoutes from './Routes/projectsRoutes.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './Routes/messageRoutes.js';

const app = express();

const PORT = process.env.PORT ;
app.use(cookieParser());

app.use(express.json());
// CORS config
app.use(cors({
  origin: 'https://mock-sms.vercel.app', // your frontend's URL
  credentials: true
}));
app.use('/api/auth',authRoutes);
app.use('/api/project',projectsRoutes);
app.use('/api/apikey',apiKeyRoutes);
app.use('/api/message', messageRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});