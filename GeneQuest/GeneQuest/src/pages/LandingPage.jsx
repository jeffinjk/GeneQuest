import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dna } from 'lucide-react';
import '../App.css';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center space-x-4"
        >
          <Dna className="h-16 w-16 text-indigo-400" />
          <h1 className="text-6xl font-bold text-white">
            Gene<span className="text-indigo-400">Quest</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-md mx-auto"
        >
          Explore the world of genetics through interactive learning and visualization
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <Link
            to="/signup"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;