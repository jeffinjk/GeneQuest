import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Trophy, Brain, CheckCircle, XCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What is the process of converting DNA to RNA called?",
    options: ["Translation", "Transcription", "Replication", "Transduction"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which software is commonly used for sequence alignment?",
    options: ["BLAST", "Photoshop", "Excel", "Word"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "What does FASTA format store?",
    options: ["Images", "Sequence data", "Sound files", "Videos"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Which is NOT a nucleotide base found in DNA?",
    options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What does PCR stand for?",
    options: ["Protein Chain Reaction", "Polymerase Chain Reaction", "Peptide Chain Reaction", "Primary Chain Reaction"],
    correctAnswer: 1
  }
];

const leaderboard = [
  { name: "Alice", score: 500, time: "2:45" },
  { name: "Bob", score: 450, time: "2:30" },
  { name: "Charlie", score: 400, time: "2:15" },
  { name: "Diana", score: 350, time: "3:00" },
  { name: "Eve", score: 300, time: "2:50" }
];

const GeQuefy = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsQuizComplete(true);
    }
  }, [timeLeft, isQuizComplete]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 100);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsQuizComplete(true);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2"
          >
            <Brain className="w-8 h-8" />
            <h1 className="text-3xl font-bold">GeQuefy</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center space-x-2"
            >
              <Timer className="w-6 h-6" />
              <span className="text-xl">{formatTime(timeLeft)}</span>
            </motion.div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6" />
              <span className="text-xl">{score}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quiz Section */}
          <motion.div
            layout
            className="bg-gray-800 rounded-lg p-6 shadow-xl"
          >
            {!isQuizComplete ? (
              <div>
                <h2 className="text-xl mb-4">Question {currentQuestion + 1} of {questions.length}</h2>
                <p className="text-lg mb-6">{questions[currentQuestion].question}</p>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedAnswer === null
                          ? 'bg-blue-900 hover:bg-blue-800'
                          : selectedAnswer === index
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'bg-green-600'
                            : 'bg-red-600'
                          : 'bg-blue-900'
                      }`}
                    >
                      {option}
                      {selectedAnswer === index && (
                        <span className="float-right">
                          {index === questions[currentQuestion].correctAnswer ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <XCircle className="w-6 h-6" />
                          )}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <h2 className="text-2xl mb-4">Quiz Complete!</h2>
                <p className="text-xl mb-2">Your Score: {score}</p>
                <p className="text-lg">Time Taken: {formatTime(180 - timeLeft)}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div
            layout
            className="bg-gray-800 rounded-lg p-6 shadow-xl"
          >
            <h2 className="text-2xl mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Leaderboard
            </h2>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-blue-900 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                    <span>{entry.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{entry.score} pts</span>
                    <span className="text-sm text-gray-300">{entry.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GeQuefy;