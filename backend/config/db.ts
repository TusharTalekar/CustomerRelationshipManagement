import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected Successfully");
    } catch (err) {
        console.log("MongoDB connection failed!", err);
        process.exit(1);
    }
}

export default connectDB;
