import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircleMore } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm July, your Favourite Assistant😊. How can I help you today?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI('AIzaSyBBmNXQqG_5UX1tVpXRptR11ruv4aTXxQE');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setMessage('');
    setIsTyping(true);

    try {
      // API call to Gemini
      const prompt = `You are July, a friendly and conversational chatbot assistant. You are assisting in giving information about everything bioinformation, like gene mutation, visualization.Respond in an understandable way and within a sentence. Avoid bold and italics as it affects the visual pleasure of the response. No need to introduce yourself unless you asked about yourself.Respond to the following message in a conversational manner as if you are talking to a person: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botReply = await response.text();

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

        <div className="h-96 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-900">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'bot' ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} rounded-lg p-3`}>
              <p className="text-white">{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 bg-indigo-500/10 rounded-lg p-3">
              <MessageCircleMore className="text-white" />
            </div>
          )}
          <div ref={messagesEndRef} />
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