import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Smart Reply
export const generateSmartReply = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Missing message" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const prompt = `Suggest a short and smart reply for: "${message}". Just the reply, no explanation. Give only one concise suggestion.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const suggestions = text.split("\n").map((s) => s.trim()).filter((s) => s);

    res.json({ suggestions });
  } catch (error) {
    console.error("Gemini smart reply error:", error);
    res.status(500).json({ message: "Gemini smart reply generation failed" });
  }
};

// Translate
export const translateMessage = async (req, res) => {
  const { message, targetLanguage } = req.body;

  if (!message || !targetLanguage) {
    return res.status(400).json({ message: "Missing text or targetLang" });
  }

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        q: message,
        target: targetLanguage,
        format: "text",
      }
    );

    const translation = response.data.data.translations[0].translatedText;
    res.json({ translation });
  } catch (error) {
    console.error("Translation API error:", error?.response?.data || error);
    res.status(500).json({ message: "Translation failed" });
  }
};
