import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
};
export default connectDB;
