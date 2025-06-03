import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plaintext for MVP; can hash later
}, { timestamps: true });

export default mongoose.model("User", userSchema);
