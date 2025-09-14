const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const connectDB = require('./config/db');


const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to api");
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;