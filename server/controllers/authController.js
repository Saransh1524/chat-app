import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";


const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;
export const register = async (req, res) => {
  // registration logic
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, user: { username: user.username } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  // login logic

  const { username, password } = req.body;
    
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ success: true, token, user: { username: user.username } });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
};
