const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');


const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to api");
});

// Auth 
app.use('/api/auth', authRoutes);

// Customer 
app.use('/api/customers', customerRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;