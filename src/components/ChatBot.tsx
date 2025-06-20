import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getEnvVar } from "../lib/env";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import {
  Send,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Trash2,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GEMINI_API_KEY = getEnvVar("VITE_GEMINI_API_KEY");
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    if (!GEMINI_API_KEY) {
      toast.error(
        "API key not configured. Please check your environment variables.",
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Focus the input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: inputText }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to get response from AI",
        );
      }

      const data = await response.json();
      const aiResponse =
        data.candidates[0]?.content?.parts[0]?.text ||
        "Sorry, I couldn't generate a response.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      toast.error(
        error.message || "Failed to get AI response. Please try again.",
      );
    } finally {
      setIsLoading(false);
      // Ensure focus returns to input after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out. Please try again");
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat cleared");
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 shadow-xl z-40 p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2">
                <Bot className="text-black dark:text-white" size={24} />
                <h2 className="text-xl font-bold text-black dark:text-white">
                  MRBOT
                </h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-black dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Signed in as:
                    </p>
                    <p className="font-medium text-black dark:text-white">
                      {getUserDisplayName()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <button
                onClick={clearChat}
                className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear Chat</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 p-4 flex justify-between items-center shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-black dark:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-black dark:text-white">
                MRBOT
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-black dark:text-white"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles size={16} className="text-blue-500" />
              <span>Welcome, {getUserDisplayName()}</span>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${message.isUser ? "order-2" : "order-1"}`}
                >
                  <div
                    className={`flex items-start space-x-3 ${message.isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        message.isUser
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                      }`}
                    >
                      {message.isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.isUser
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-black dark:text-white shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%]">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-black dark:text-white">Thinking</span>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-base p-3 rounded-lg outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-500 disabled:cursor-not-allowed px-6 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
