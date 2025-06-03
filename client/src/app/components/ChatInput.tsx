import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "@lib/socket";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "gu", name: "Gujarati" },
  { code: "ar", name: "Arabic" },
  { code: "ja", name: "Japanese" },
  { code: "ru", name: "Russian" },
  { code: "mr", name: "Marathi" },
];

const ChatInput = ({
  username,
  lastMessage,
}: {
  username: string;
  lastMessage: string;
}) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [translatedMessage, setTranslatedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lastMessage) return;

    setLoading(true);
    setError(null);

    const fetchSuggestionsAndTranslation = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/smart-reply", {
          message: lastMessage,
        });
        setSuggestions(res.data.suggestions || []);

        const translationRes = await axios.post(
          "http://localhost:5000/api/translate",
          {
            message: lastMessage,
            targetLanguage: preferredLanguage,
          }
        );
        setTranslatedMessage(translationRes.data.translation || "");
      } catch (err: any) {
        setError("Failed to fetch suggestions or translation.");
        setSuggestions([]);
        setTranslatedMessage("");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestionsAndTranslation();
  }, [lastMessage, preferredLanguage]);

  const handleSend = () => {
    if (text.trim() === "") return;
    socket.emit("send_message", { username, text });
    setText("");
    setSuggestions([]);
    setTranslatedMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
  };

  return (
    <div className="bg-gray/80 backdrop-blur-md shadow-xl rounded-2xl p-6 max-w-2xl mx-auto mt-6 border border-gray-200">
      {/* Language Selector */}
      <div className="flex items-center mb-4">
        <label
          htmlFor="language-select"
          className="mr-3 font-medium text-white"
        >
          Translate to:
        </label>
        <select
          id="language-select"
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value)}
          className="border px-3 py-2 rounded-lg bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-black">
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show Translated Message */}
      {translatedMessage && (
        <div className="mb-3 px-3 py-2 bg-blue-50 rounded text-blue-700 text-sm">
          <span className="font-semibold">Translated:</span> {translatedMessage}
        </div>
      )}

      {/* Loading/Error */}
      {loading && (
        <div className="mb-2 text-blue-500 animate-pulse">
          Loading suggestions...
        </div>
      )}
      {error && <div className="mb-2 text-red-500">{error}</div>}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="bg-gray-200 hover:bg-blue-200 text-gray-800 rounded-full px-4 py-1 text-sm transition shadow"
              aria-label={`Suggestion: ${s}`}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input & Send */}
      <div className="flex space-x-2 mt-2">
        <input
          className="border border-gray-300 p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          aria-label="Chat message input"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50"
          disabled={text.trim() === ""}
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

