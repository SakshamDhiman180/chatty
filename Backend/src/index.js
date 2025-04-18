import express from 'express';
import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoute.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
  console.log('Server is running on port', port);
  connectDB()
});