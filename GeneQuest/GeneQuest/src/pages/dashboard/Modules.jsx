import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Dna, FileText, ChevronDown, ChevronRight, Award, Sparkles, Microscope, Binary, FlaskRound as Flask, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

const modules = [
  {
    id: 1,
    title: 'Introduction to Gene Visualization',
    icon: Dna,
    description: 'Learn the fundamentals of gene visualization and DNA structure',
    subchapters: [
      {
        id: 'sc1',
        title: 'Understanding DNA Sequences',
        flowCards: [
          {
            id: 'fc1',
            title: 'DNA Structure and Components',
            content: 'DNA (Deoxyribonucleic Acid) is the molecule that carries genetic instructions for the development, functioning, growth, and reproduction of all known organisms. It is composed of two strands that coil around each other to form a double helix.',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'DNA Structure', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Phosphate Group', children: ['n5'] },
              { id: 'n3', text: 'Sugar (Deoxyribose)', children: ['n6'] },
              { id: 'n4', text: 'Nitrogenous Bases', children: ['n7', 'n8', 'n9', 'n10'] },
              { id: 'n5', text: 'Negatively Charged' },
              { id: 'n6', text: '5-Carbon Sugar' },
              { id: 'n7', text: 'Adenine (A)' },
              { id: 'n8', text: 'Thymine (T)' },
              { id: 'n9', text: 'Cytosine (C)' },
              { id: 'n10', text: 'Guanine (G)' }
            ]
          },
          {
            id: 'fc2',
            title: 'Base Pairing Rules',
            content: 'The four DNA bases pair specifically: Adenine (A) with Thymine (T), and Cytosine (C) with Guanine (G). This base pairing is crucial for DNA replication and transcription.',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Base Pairing Rules', children: ['n2', 'n3'] },
              { id: 'n2', text: 'A-T Bond', children: ['n4', 'n5'] },
              { id: 'n3', text: 'C-G Bond', children: ['n6', 'n7'] },
              { id: 'n4', text: '2 Hydrogen Bonds' },
              { id: 'n5', text: 'Weak Bond' },
              { id: 'n6', text: '3 Hydrogen Bonds' },
              { id: 'n7', text: 'Strong Bond' }
            ]
          },
          {
            id: 'fc3',
            title: 'DNA Replication',
            content: 'DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule. This process occurs before cell division.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'DNA Replication', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Unwinding', children: ['n5'] },
              { id: 'n3', text: 'Base Pairing', children: ['n6'] },
              { id: 'n4', text: 'Synthesis', children: ['n7'] },
              { id: 'n5', text: 'Helicase Enzyme' },
              { id: 'n6', text: 'Complementary Bases' },
              { id: 'n7', text: 'DNA Polymerase' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Visualization Methods',
        flowCards: [
          {
            id: 'fc4',
            title: 'Linear Sequence View',
            content: 'The linear sequence view is the most basic form of DNA visualization, displaying the sequence as a string of letters representing the four nucleotides.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Linear Sequence', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Forward Strand', children: ['n4', 'n5'] },
              { id: 'n3', text: 'Reverse Strand', children: ['n6', 'n7'] },
              { id: 'n4', text: "5' End" },
              { id: 'n5', text: "3' End" },
              { id: 'n6', text: "3' End" },
              { id: 'n7', text: "5' End" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the structure of DNA?',
        options: ['Single helix', 'Double helix', 'Triple helix', 'Straight line'],
        answer: 'Double helix'
      },
      {
        id: 'q2',
        question: 'Which base pairs with Adenine?',
        options: ['Cytosine', 'Guanine', 'Thymine', 'Another Adenine'],
        answer: 'Thymine'
      },
      {
        id: 'q3',
        question: 'What is the first step of gene expression?',
        options: ['Translation', 'Transcription', 'Replication', 'Mutation'],
        answer: 'Transcription'
      }
    ]
  },
  {
    id: 2,
    title: 'Sequence Analysis Tools',
    icon: Microscope,
    description: 'Explore tools and techniques for analyzing gene sequences'
  },
  {
    id: 3,
    title: 'Bioinformatics Algorithms',
    icon: Binary,
    description: 'Learn key algorithms used in genetic data analysis'
  },
  {
    id: 4,
    title: 'Laboratory Techniques',
    icon: Flask,
    description: 'Understanding common lab procedures in genetics'
  },
  {
    id: 5,
    title: 'Advanced Genomics',
    icon: Brain,
    description: 'Explore cutting-edge topics in genomics research'
  }
];

const Flowchart = ({ nodes }) => {
  return (
    <div className="mt-6 p-6 glass-effect rounded-lg">
      <div className="flex flex-col items-center space-y-8">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flowchart-node bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-lg text-center min-w-[200px] shadow-lg"
            >
              {node.text}
            </motion.div>
            {node.children && (
              <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <svg width="2" height="32" className="overflow-visible">
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="32"
                    className="flowchart-line"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
            {node.children && (
              <div className="flex gap-6 mt-8">
                {node.children.map((childId) => {
                  const childNode = nodes.find(n => n.id === childId);
                  return childNode ? (
                    <motion.div
                      key={childId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="flowchart-node bg-gradient-to-r from-blue-500 to-blue-300 text-white p-3 rounded-lg text-center min-w-[150px] shadow-lg"
                    >
                      {childNode.text}
                    </motion.div>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const celebrateCompletion = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.1, y: 0.6 }
  });

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.9, y: 0.6 }
  });

  setTimeout(() => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { x: 0.5, y: 0.5 }
    });
  }, 250);
};

const Modules = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedSubchapter, setSelectedSubchapter] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [xp, setXp] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setSelectedSubchapter(null);
    setShowQuiz(false);
    setCurrentCardIndex(0);
  };

  const selectSubchapter = (subchapter) => {
    setSelectedSubchapter(subchapter);
    setShowQuiz(false);
    setCurrentCardIndex(0);
  };

  const nextCard = () => {
    if (selectedSubchapter && currentCardIndex < selectedSubchapter.flowCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const startQuiz = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (module?.quiz) {
      setCurrentQuiz(module.quiz);
      setShowQuiz(true);
      setSelectedSubchapter(null);
    }
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    currentQuiz.forEach((question) => {
      if (quizAnswers[question.id] === question.answer) {
        correctAnswers++;
      }
    });

    if (correctAnswers === currentQuiz.length) {
      const newXp = xp + 50;
      setXp(newXp);
      setShowSuccessModal(true);
      celebrateCompletion();
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } else {
      alert('Keep trying! You need all answers correct to complete the module.');
    }
    setShowQuiz(false);
    setQuizAnswers({});
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Book className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Learning Modules</h1>
          <div className="ml-auto flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{xp} XP</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Level {Math.floor(xp / 100) + 1}</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Module List
              </h2>
              <div className="space-y-3">
                {modules.map((module) => (
                  <motion.div
                    key={module.id}
                    initial={false}
                    animate={{ backgroundColor: expandedModule === module.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                    className="rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2 text-white hover:bg-gray-700 p-2 rounded-md transition-colors">
                        <module.icon className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-gray-400">{module.description}</div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedModule === module.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedModule === module.id && module.subchapters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-7 space-y-2 mt-2">
                            {module.subchapters.map((subchapter) => (
                              <motion.button
                                key={subchapter.id}
                                whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                onClick={() => selectSubchapter(subchapter)}
                                className={`text-sm py-1 px-2 rounded-md w-full text-left ${
                                  selectedSubchapter?.id === subchapter.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                              >
                                {subchapter.title}
                              </motion.button>
                            ))}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => startQuiz(module.id)}
                              className="w-full text-sm py-1 px-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                            >
                              Take Final Quiz
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              {showQuiz ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Final Quiz</h2>
                  <div className="space-y-6">
                    {currentQuiz.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700 p-4 rounded-lg"
                      >
                        <p className="text-white text-lg mb-3">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-600 cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                onChange={(e) =>
                                  setQuizAnswers({ ...quizAnswers, [question.id]: e.target.value })
                                }
                                className="w-4 h-4 text-blue-500"
                              />
                              <span className="text-gray-200">{option}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleQuizSubmit}
                      className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                    >
                      Submit Quiz
                    </motion.button>
                  </div>
                </motion.div>
              ) : selectedSubchapter ? (
                <motion.div
                  key={selectedSubchapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedSubchapter.title}
                  </h2>
                  {selectedSubchapter.flowCards && (
                    <div className="relative">
                      <motion.div
                        key={currentCardIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-gray-700 rounded-lg overflow-hidden"
                      >
                        <img
                          src={selectedSubchapter.flowCards[currentCardIndex].image}
                          alt={selectedSubchapter.flowCards[currentCardIndex].title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {selectedSubchapter.flowCards[currentCardIndex].title}
                          </h3>
                          <p className="text-gray-300 mb-4">
                            {selectedSubchapter.flowCards[currentCardIndex].content}
                          </p>
                          {selectedSubchapter.flowCards[currentCardIndex].flowchart && (
                            <Flowchart nodes={selectedSubchapter.flowCards[currentCardIndex].flowchart} />
                          )}
                        </div>
                      </motion.div>
                      <div className="flex justify-between mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={previousCard}
                          disabled={currentCardIndex === 0}
                          className={`px-4 py-2 rounded-md ${
                            currentCardIndex === 0
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Previous
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextCard}
                          disabled={currentCardIndex === selectedSubchapter.flowCards.length - 1}
                          className={`px-4 py-2 rounded-md ${
                            currentCardIndex === selectedSubchapter.flowCards.length - 1
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Next
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Dna className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-xl text-gray-300">
                    Select a chapter to start learning
                  </h2>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gray-800 p-8 rounded-lg shadow-xl text-center transform transition-all duration-300"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🧬
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-blue-400 text-lg"
              >
                +50 XP Earned
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mt-2"
              >
                You've mastered this module!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modules;