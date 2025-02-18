import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Microscope, 
  Brain, 
  GraduationCap, 
  HeartPulse, 
  Database,
  Upload,
  Bot,
  Trophy,
  FileCode,
  Users,
  Sparkles
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
  >
    <Icon className="h-8 w-8 text-indigo-400 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-950">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center opacity-10" />
        <div className="text-center space-y-8 relative z-10 max-w-7xl mx-auto">
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
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Your comprehensive platform for genomic exploration and learning. Upload genetic data, 
            visualize sequences, and master complex concepts through interactive learning modules. 
            Perfect for students, educators, and researchers alike.
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

      {/* Core Features Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-blue-950 to-indigo-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of tools for genetic data analysis and learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Upload}
              title="Data Processing"
              description="Upload and process FASTA and VCF files with ease. Our platform handles complex genomic data formats seamlessly."
            />
            <FeatureCard
              icon={Trophy}
              title="Gamified Learning"
              description="Master genetics through interactive quizzes, challenges, and progress tracking. Learn at your own pace."
            />
            <FeatureCard
              icon={Bot}
              title="AI Assistant"
              description="Get real-time help from our AI-powered chatbot. Receive explanations and guidance whenever you need it."
            />
          </div>
        </div>
      </div>

      {/* Visualization Tools Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Advanced Visualization</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              State-of-the-art tools for exploring and understanding genetic data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Microscope}
              title="Interactive Visualization"
              description="Explore gene sequences with intuitive controls. Zoom, pan, and analyze with precision."
            />
            <FeatureCard
              icon={FileCode}
              title="Mutation Analysis"
              description="Highlight and annotate genetic variations. Understand the impact of mutations on gene function."
            />
            <FeatureCard
              icon={Sparkles}
              title="Real-time Annotations"
              description="Add and view annotations in real-time. Collaborate with peers on genetic analysis."
            />
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-indigo-950 to-blue-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Who It's For</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Designed for everyone in the field of genetics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-xl p-6"
            >
              <GraduationCap className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Students</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Interactive learning modules</li>
                <li>Progress tracking</li>
                <li>Simplified visualizations</li>
                <li>Guided tutorials</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-xl p-6"
            >
              <Users className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Educators</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Teaching resources</li>
                <li>Student progress monitoring</li>
                <li>Customizable content</li>
                <li>Classroom tools</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-xl p-6"
            >
              <Brain className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Researchers</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Advanced analysis tools</li>
                <li>Data processing capabilities</li>
                <li>Collaboration features</li>
                <li>Research-grade visualizations</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;