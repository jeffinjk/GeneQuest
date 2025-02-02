import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Trophy, Brain, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  limit,
  where,
  Timestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

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

const GeQuefy = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [quizTime, setQuizTime] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [error, setError] = useState(null);
  const [userBestScore, setUserBestScore] = useState(null);

  const timeOptions = [
    { seconds: 30, label: '30 Seconds' },
    { seconds: 60, label: '1 Minute' },
    { seconds: 120, label: '2 Minutes' },
    { seconds: 180, label: '3 Minutes' }
  ];

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardRef = collection(db, "leaderboard");
        const q = query(leaderboardRef, orderBy("score", "desc"));
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Store only the top 5 scores in state
        setLeaderboard(leaderboardData.slice(0, 5));

        if (user) {
          const userScoresQuery = query(
            leaderboardRef,
            where("userId", "==", user.uid),
            orderBy("score", "desc"),
            limit(1)
          );
          const userScoresSnapshot = await getDocs(userScoresQuery);
          if (!userScoresSnapshot.empty) {
            setUserBestScore(userScoresSnapshot.docs[0].data().score);
          }
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
      }
    };

    fetchLeaderboardData();
}, [user]);

  useEffect(() => {
    if (timeLeft > 0 && isQuizStarted && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsQuizComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isQuizStarted, isQuizComplete]);

  const handleAnswerSelect = async (answerIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / quizTime * 50);
      setScore(prev => prev + 100 + timeBonus);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsQuizComplete(true);
        handleQuizComplete();
      }
    }, 1000);
  };

  const handleQuizComplete = async () => {
    if (!user) {
      setError('You must be logged in to save your score');
      return;
    }

    try {
      const timeTaken = quizTime - timeLeft;
      
      const userDocRef = doc(db, "leaderboard", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const newScore = {
        userId: user.uid,
        name: user.displayName || 'Anonymous',
        score,
        time: timeTaken,
        timeLimit: quizTime,
        timestamp: Timestamp.now()
      };

      if (!userDocSnap.exists() || userDocSnap.data().score < score) {
        await setDoc(userDocRef, newScore);
        setUserBestScore(score);
      }

      const leaderboardRef = collection(db, "leaderboard");
      const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save your score');
    }
  };

  const handleTimeSelect = (seconds) => {
    setQuizTime(seconds);
    setTimeLeft(seconds);
    setIsTimeSelected(true);
    setIsQuizStarted(true);
    setError(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(0);
    setIsQuizComplete(false);
    setSelectedAnswer(null);
    setIsTimeSelected(false);
    setIsQuizStarted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white p-8">
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
            <Brain className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold">GeQuefy</h1>
          </motion.div>
          {isQuizStarted && (
            <div className="flex items-center space-x-6">
              <motion.div
                animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: timeLeft < 10 ? Infinity : 0, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-400' : 'text-indigo-400'}`} />
                <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
              </motion.div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-indigo-400" />
                <span className="text-xl">{score}</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </motion.div>
        )}

        {!isTimeSelected && !isQuizStarted && (
          <motion.div
            className="bg-navy-900 rounded-xl p-6 border border-indigo-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">Select Quiz Time</h2>
            <div className="grid grid-cols-2 gap-4">
              {timeOptions.map(({ seconds, label }) => (
                <motion.button
                  key={seconds}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTimeSelect(seconds)}
                  className="bg-navy-800 text-white p-4 rounded-lg transition-colors hover:bg-indigo-600/20 border border-indigo-500/20"
                >
                  {label}
                </motion.button>
              ))}
            </div>
            {userBestScore !== null && (
              <div className="mt-6 text-center text-gray-400">
                Your Best Score: {userBestScore} points
              </div>
            )}
          </motion.div>
        )}

        {isTimeSelected && isQuizStarted && !isQuizComplete && (
          <motion.div
            layout
            className="bg-navy-900 rounded-xl p-6 border border-indigo-500/20"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h2>
                <span className="text-gray-400">Score: {score}</span>
              </div>
              <p className="text-lg">{questions[currentQuestion].question}</p>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedAnswer === null
                        ? 'bg-navy-800 hover:bg-indigo-600/20 border border-indigo-500/20'
                        : selectedAnswer === index
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border border-green-500/20'
                          : 'bg-red-500/20 border border-red-500/20'
                        : 'bg-navy-800 border border-indigo-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      {selectedAnswer === index && (
                        <span>
                          {index === questions[currentQuestion].correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {isQuizComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-navy-900 rounded-xl p-8 border border-indigo-500/20 text-center"
          >
            <Trophy className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl">Final Score: {score} points</p>
              <p className="text-gray-400">Time Taken: {formatTime(quizTime - timeLeft)}</p>
              {userBestScore !== null && score > userBestScore && (
                <p className="text-green-400">New Personal Best!</p>
              )}
            </div>
            <button
              onClick={restartQuiz}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        <motion.div
          layout
          className="bg-navy-900 rounded-xl p-6 border border-indigo-500/20 mt-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="w-6 h-6 text-indigo-400 mr-2" />
            Leaderboard
          </h2>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-navy-800 rounded-lg border border-indigo-500/20"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-indigo-400">#{index + 1}</span>
                  <span>{entry.name}</span>
                  {entry.userId === user?.uid && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">{entry.score} pts</span>
                  <span className="text-sm text-gray-400">{formatTime(entry.time)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GeQuefy;