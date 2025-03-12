import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rth5xhw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("MongoDB Connected ✅");
        ;

    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        process.exit(1);;

    }
};

export default connectDB;