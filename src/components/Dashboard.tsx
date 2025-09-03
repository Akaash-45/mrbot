import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { ChatBot } from "./ChatBot";
import { AuthModal } from "./AuthModal";
import Footer from "./Footer";
import { Bot, MessageCircle, Shield, Zap, Moon, Sun, Sparkles, ArrowRight } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="relative"
        >
          <Bot size={48} className="text-black dark:text-white" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full border-2 border-black dark:border-white opacity-30"
          />
        </motion.div>
      </div>
    );
  }

  if (user) {
    return <ChatBot />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-10 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        {isDark ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-blue-600" />}
      </motion.button>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12 max-w-6xl mx-auto"
        >
          {/* Logo and Branding */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  boxShadow: isDark 
                    ? ["0 0 20px rgba(255,255,255,0.2)", "0 0 40px rgba(255,255,255,0.4)", "0 0 20px rgba(255,255,255,0.2)"]
                    : ["0 0 20px rgba(0,0,0,0.1)", "0 0 40px rgba(0,0,0,0.2)", "0 0 20px rgba(0,0,0,0.1)"]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
              >
                <Bot size={64} className="text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-xl"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MRBOT
              </h1>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                <Sparkles size={20} />
                <span className="text-lg font-medium">AI-Powered Assistant</span>
                <Sparkles size={20} />
              </div>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Experience the future of AI conversation with{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MRBOT
              </span>
              . Get instant answers, creative solutions, and professional assistance powered by advanced AI technology.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <MessageCircle size={16} />
                <span>Natural Conversations</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <Zap size={16} />
                <span>Instant Responses</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <Shield size={16} />
                <span>Secure & Private</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center space-x-3">
                <span>Start Chatting Now</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto"
        >
          {[
            {
              icon: MessageCircle,
              title: "Smart Conversations",
              description: "Engage in natural, intelligent conversations with our advanced AI powered by Google's Gemini.",
              gradient: "from-green-500 to-emerald-600",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Get instant responses with minimal latency. Our optimized infrastructure ensures smooth interactions.",
              gradient: "from-yellow-500 to-orange-600",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your conversations are protected with enterprise-grade security and Firebase authentication.",
              gradient: "from-red-500 to-pink-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
