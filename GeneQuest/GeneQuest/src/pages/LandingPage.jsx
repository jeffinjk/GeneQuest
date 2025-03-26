import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Dna, 
  Microscope, 
  Brain, 
  GraduationCap, 
  Upload,
  Bot,
  Trophy,
  FileCode,
  Users,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    viewport={{ once: true }}
    className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
  >
    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-3 w-fit mb-6">
      <Icon className="h-7 w-7 text-indigo-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-[#070B1A]">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B1A]/80 to-[#070B1A]" />
        
        <div className="text-center space-y-8 relative z-10 max-w-7xl mx-auto pt-32">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="text-indigo-400 mr-2">🧬</span>
            <span className="text-gray-300">Revolutionizing Genetic Research</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-7xl font-bold text-white leading-tight">
              Explore the Power of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Genomic Data
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive platform for genomic exploration and learning. Upload genetic data, 
              visualize sequences, and master complex concepts through interactive learning modules.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 pt-8"
          >
            <Link
              to="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/10"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need for
              <span className="text-indigo-400"> genetic analysis</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of tools designed for researchers, educators, and students
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Upload}
              title="Intelligent Data Processing"
              description="Upload and process FASTA and VCF files with our advanced AI-powered system that handles complex genomic data formats."
            />
            <FeatureCard
              icon={Trophy}
              title="Interactive Learning"
              description="Master genetics through gamified experiences, real-time challenges, and personalized progress tracking."
            />
            <FeatureCard
              icon={Bot}
              title="AI Research Assistant"
              description="Get instant help from our sophisticated AI that understands complex genetic queries and provides detailed explanations."
            />
            <FeatureCard
              icon={Microscope}
              title="3D Visualization"
              description="Explore genetic structures in stunning 3D with our advanced visualization engine. Zoom, rotate, and analyze with precision."
            />
            <FeatureCard
              icon={FileCode}
              title="Smart Annotations"
              description="Automatically detect and annotate genetic variations with our machine learning algorithms."
            />
            <FeatureCard
              icon={Sparkles}
              title="Collaboration Tools"
              description="Work seamlessly with your team using real-time collaboration features and shared workspaces."
            />
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="py-32 px-4 bg-gradient-to-b from-indigo-950/50 to-[#070B1A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Built for everyone</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you're a student, educator, or researcher, GeneQuest adapts to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                features: ["Interactive tutorials", "Progress tracking", "Simplified visualizations", "Practice exercises"],
              },
              {
                icon: Users,
                title: "Educators",
                features: ["Course management", "Student analytics", "Custom content creation", "Assessment tools"],
              },
              {
                icon: Brain,
                title: "Researchers",
                features: ["Advanced analysis", "Data processing", "API access", "Custom workflows"],
              }
            ].map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-3 w-fit mb-6">
                  <role.icon className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">{role.title}</h3>
                <ul className="space-y-4">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <ChevronRight className="h-4 w-4 text-indigo-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start your genetic journey?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers, educators, and students who are already using GeneQuest
            to unlock the secrets of genetic data.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;