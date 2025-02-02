import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, AArrowDown as DNA, FileText, ChevronDown, ChevronRight, Microscope, Binary, BarChart3, Dna } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: 'Introduction to Gene Visualization',
    icon: DNA,
    chapters: [
      { id: 'c1', title: 'Understanding DNA Sequences', content: 'Learn about DNA sequence representation and basic structure.' },
      { id: 'c2', title: 'Visualization Methods', content: 'Overview of different methods used in gene sequence visualization.' },
      { id: 'c3', title: 'File Formats', content: 'Understanding FASTA and VCF file formats in bioinformatics.' }
    ]
  },
  {
    id: 2,
    title: '2D Visualization Techniques',
    icon: BarChart3,
    chapters: [
      { id: 'c4', title: 'Linear Representations', content: 'Methods for displaying DNA sequences in a linear format.' },
      { id: 'c5', title: 'Color Coding', content: 'Using colors to represent different nucleotides and patterns.' },
      { id: 'c6', title: 'Sequence Analysis', content: 'Analyzing patterns and features in 2D visualizations.' }
    ]
  },
  {
    id: 3,
    title: '3D Visualization and Analysis',
    icon: Binary,
    chapters: [
      { id: 'c7', title: '3D Structure Basics', content: 'Understanding 3D representation of gene sequences.' },
      { id: 'c8', title: 'Interactive Navigation', content: 'How to interact with 3D molecular structures.' },
      { id: 'c9', title: 'Advanced Analysis', content: 'Advanced techniques for 3D sequence analysis.' }
    ]
  },
  {
    id: 4,
    title: 'Advanced Topics',
    icon: Microscope,
    chapters: [
      { id: 'c10', title: 'Comparative Analysis', content: 'Methods for comparing multiple sequences.' },
      { id: 'c11', title: 'Pattern Recognition', content: 'Identifying patterns and motifs in sequences.' },
      { id: 'c12', title: 'Research Applications', content: 'Real-world applications in research and medicine.' }
    ]
  }
];

const Modules = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const selectChapter = (chapter) => {
    setSelectedChapter(chapter);
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Module List
              </h2>
              <div className="space-y-3">
                {modules.map((module) => (
                  <motion.div
                    key={module.id}
                    initial={false}
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2 text-white hover:bg-gray-700 p-2 rounded-md transition-colors">
                        <module.icon className="w-5 h-5 text-blue-400" />
                        <span className="flex-1">{module.title}</span>
                        {expandedModule === module.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-7 space-y-2 mt-2">
                            {module.chapters.map((chapter) => (
                              <motion.button
                                key={chapter.id}
                                whileHover={{ x: 4 }}
                                onClick={() => selectChapter(chapter)}
                                className={`text-sm py-1 px-2 rounded-md w-full text-left ${
                                  selectedChapter?.id === chapter.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                              >
                                {chapter.title}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              {selectedChapter ? (
                <motion.div
                  key={selectedChapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedChapter.title}
                  </h2>
                  <div className="prose prose-invert">
                    <p className="text-gray-300">{selectedChapter.content}</p>
                    
                    {/* Example content section */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-xl font-semibold text-white">Key Points</h3>
                      <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        <li>Understanding the fundamental concepts of gene sequence visualization</li>
                        <li>Learning different visualization techniques and their applications</li>
                        <li>Practical examples and use cases in research</li>
                        <li>Best practices for sequence analysis and interpretation</li>
                      </ul>
                      
                      <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                          <Dna className="w-5 h-5 text-blue-400" />
                          Practice Exercise
                        </h4>
                        <p className="text-gray-300">
                          Try visualizing a sample gene sequence using the techniques discussed in this chapter.
                          Use the visualization tool to analyze patterns and structures.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <DNA className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-xl text-gray-300">
                    Select a chapter to start learning
                  </h2>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modules;