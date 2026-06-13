import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

dotenv.config();
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// export = app;
