import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

const Chatbot = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your GeneQuest assistant. How can I help you today?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const GEMINI_API_KEY = "AIzaSyBBmNXQqG_5UX1tVpXRptR11ruv4aTXxQE";
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setMessage("");
    setIsTyping(true);

    try {
      // API call to Gemini
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.contents && data.contents[0] && data.contents[0].parts) {
        const botReply = data.contents[0].parts.map((part) => part.text).join(" ");
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I couldn't process that. Please try again!", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: 20 }}
        className="fixed bottom-4 right-4 w-80 bg-navy-900 rounded-lg shadow-xl border border-indigo-500/20 overflow-hidden"
      >
        <div className="p-4 bg-indigo-600 flex justify-between items-center">
          <h3 className="text-white font-medium">GeneQuest Assistant</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-96 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 mb-4 rounded-lg ${
                msg.sender === "bot"
                  ? "bg-indigo-500/10 text-white"
                  : "bg-indigo-700 text-gray-200 self-end"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="p-3 mb-4 bg-indigo-500/10 rounded-lg">
              <p className="text-white">...</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-indigo-500/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-navy-800 border border-indigo-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
