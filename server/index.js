import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { authenticateToken } from "./middlewares/auth.js";
import { socketHandler } from "./config/socket.js";
import Message from "./models/Message.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDB();


const app = express();
const server = http.createServer(app);
socketHandler(server);

app.use(cors());
app.use(express.json());
app.use("/api", aiRoutes);
app.use("/api", authRoutes);
// API route to get messages
app.get("/api/messages", authenticateToken, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(20);
  res.json(messages.reverse());
});


// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("MongoDB error:", err));

// Socket.io logic
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Send last 20 messages on connect
//   Message.find().sort({ createdAt: -1 }).limit(20).then((msgs) => {
//     socket.emit("chat_history", msgs.reverse());
//   });

//   // Message sending
//   socket.on("send_message", async (data) => {
//     const username = data.username || socket.id;

//     // Save message to DB
//     const newMsg = new Message({
//       username: data.username,
//       text: data.text,
//     });
//     await newMsg.save();

//     // Broadcast to all clients
//     io.emit("receive_message", newMsg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// Register
// app.post("/api/register", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Username already exists!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ success: true, token, user: { username: user.username } });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Login
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
  
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ success: true, token, user: { username: user.username } });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Middleware to authenticate JWT
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });
//     req.user = user;
//     next();
//   });
// };


// Smart reply endpoint using Gemini
// app.post("/api/smart-reply", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ message: "Missing message" });
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
//     const prompt = `Suggest a short and smart reply for: "${message}". Just the reply, no explanation. Give only one concise suggestion.`;
//     const result = await model.generateContent(prompt);
//     const text = result.response.text().trim();
//     const suggestions = text
//       .split("\n")
//       .map((s) => s.trim())
//       .filter((s) => s);

//     res.json({ suggestions });
//   } catch (error) {
//     console.error("Gemini smart reply error:", error);
//     res.status(500).json({ message: "Gemini smart reply generation failed" });
//   }
// });

// Chat translation endpoint
// app.post("/api/translate", async (req, res) => {
//   const { message, targetLanguage } = req.body;

//   if (!message || !targetLanguage) {
//     return res.status(400).json({ message: "Missing text or targetLang" });
//   }

//   try {
//     const response = await axios.post(
//       `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
//       {
//         q: message,
//         target: targetLanguage,
//         format: "text",
//       }
//     );

//     const translation = response.data.data.translations[0].translatedText;
//     res.json({ translation });
//   } catch (error) {
//     console.error("Translation API error:", error?.response?.data || error);
//     res.status(500).json({ message: "Translation failed" });
//   }
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
