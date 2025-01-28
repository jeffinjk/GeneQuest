import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, LineChart, Brain, MessageSquareMore, Microscope, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const featureCardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 1
    }
  }
};

const LandingPage = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 z-0" />
        <motion.div 
          className="absolute inset-0 opacity-20 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <motion.div 
          className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-7xl font-bold text-white mb-6"
            variants={fadeIn}
          >
            Gene<span className="text-indigo-400">Quest</span>
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-300 mb-8 leading-relaxed"
            variants={fadeIn}
          >
           
          </motion.p>
          <motion.div 
            className="flex justify-center space-x-6"
            variants={fadeIn}
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/learn"
              className="px-8 py-4 bg-white/10 text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Advanced Features for Genetic Analysis
        </motion.h2>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Dna,
              title: "2D & 3D Gene Visualization",
              description: "Experience dynamic visual representations of gene sequences and structures. Switch between 2D and 3D views to gain deeper insights into genetic patterns."
            },
            {
              icon: Microscope,
              title: "Real-time Mutation Detection",
              description: "Automatically identify and highlight mutations in genetic sequences. Visualize different mutation types with intuitive markers and annotations."
            },
            {
              icon: Brain,
              title: "AI-Powered Analysis",
              description: "Get intelligent insights and interpretations of your genetic data through our advanced AI system. Understand complex patterns with ease."
            },
            {
              icon: Upload,
              title: "Comprehensive File Support",
              description: "Upload and analyze FASTA and VCF files with ease. Our platform supports multiple file formats for seamless genetic data analysis."
            },
            {
              icon: LineChart,
              title: "Advanced Analysis Tools",
              description: "Access powerful tools for mutation analysis, sequence comparison, and statistical analysis of genetic data."
            },
            {
              icon: MessageSquareMore,
              title: "Interactive Support",
              description: "Get real-time assistance from our AI chatbot. Ask questions about genetics, analysis results, or platform features."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-navy-900/50 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:scale-105"
              variants={featureCardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="h-14 w-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-indigo-600/10 skew-y-3 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h2 
            className="text-3xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to explore the world of genetics?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Analyzing
              <Dna className="ml-2 h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;