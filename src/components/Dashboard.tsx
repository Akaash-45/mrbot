import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ChatBot } from './ChatBot';
import { Auth } from './Auth';
import { Bot, MessageCircle, Shield, Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Bot size={48} className="text-black" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="p-6 bg-black rounded-full">
              <Bot size={64} className="text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-black"
          >
            AI Assistant
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Experience the power of AI with our intelligent chatbot. Get instant answers, 
            creative solutions, and professional assistance for any task.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-x-4"
          >
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-black text-white hover:bg-gray-800 border-2 border-black px-8 py-4 text-lg rounded-md"
            >
              Get Started
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          <div className="text-center p-8 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-300">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Conversations</h3>
            <p className="text-gray-600">Engage in natural, intelligent conversations with our advanced AI.</p>
          </div>

          <div className="text-center p-8 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-300">
            <Zap size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get instant responses powered by cutting-edge AI technology.</p>
          </div>

          <div className="text-center p-8 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-300">
            <Shield size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your conversations are protected with enterprise-grade security.</p>
          </div>
        </motion.div>
      </motion.div>

      {user ? <ChatBot /> : <Auth />}
    </div>
  );
};