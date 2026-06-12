import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import leadRoutes from './routes/leadRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to api");
});

// Auth 
app.use('/api/auth', authRoutes);

// Customer 
app.use('/api/customers', customerRoutes);

// Leads 
app.use("/api/leads", leadRoutes);


// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

export = app;
