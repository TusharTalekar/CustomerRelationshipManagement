import express, { Request, Response } from 'express';
import cors from 'cors';


import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import leadRoutes from './routes/leadRoutes';


const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to api");
});

// Auth 
app.use('/api/auth', authRoutes);

// Customer 
app.use('/api/customers', customerRoutes);

// Leads 
app.use("/api/leads", leadRoutes);

export default app;