import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Trophy, Brain, CheckCircle, XCircle, AlertCircle, Zap, BookOpen } from 'lucide-react';
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
  getDoc,
  updateDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI('AIzaSyD8MOM0pxVrdRpw5sKeC0pgJRCZXtPGWbY');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const baseQuestions = [
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
  },
  {
    id: 6,
    question: "Which database is a primary repository for nucleotide sequences?",
    options: ["GenBank", "Protein Data Bank", "PubMed", "OMIM"],
    correctAnswer: 0
  },
  {
    id: 7,
    question: "What is the central dogma of molecular biology?",
    options: ["DNA → RNA → Protein", "RNA → DNA → Protein", "Protein → RNA → DNA", "DNA → Protein → RNA"],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "Which tool is used for protein structure prediction?",
    options: ["AlphaFold", "BLAST", "ClustalW", "MEGA"],
    correctAnswer: 0
  },
  {
    id: 9,
    question: "What does BLAST stand for?",
    options: ["Basic Local Alignment Search Tool", "Biological Lineage and Sequence Tree", "Binary Logarithmic Alignment System", "Biological Linear Analysis of Sequences"],
    correctAnswer: 0
  },
  {
    "id": 10,
    "question": "Which file format is used for storing multiple sequence alignments?",
    "options": [".fasta", ".pdb", ".clustal", ".jpg"],
    "correctAnswer": 2
  },
  {
    "id": 11,
    "question": "What is the purpose of a phylogenetic tree?",
    "options": ["To show evolutionary relationships", "To display protein structures", "To organize laboratory equipment", "To count nucleotide bases"],
    "correctAnswer": 0
  },
  {
    "id": 12,
    "question": "Which of these is a common next-generation sequencing platform?",
    "options": ["Illumina", "Windows", "MacOS", "Linux"],
    "correctAnswer": 0
  },
  {
    "id": 13,
    "question": "What does SNP stand for?",
    "options": ["Single Nucleotide Polymorphism", "Small Nuclear Protein", "Systematic Network Protocol", "Sequenced Nucleotide Pair"],
    "correctAnswer": 0
  },
  {
    "id": 14,
    "question": "Which programming language is commonly used in bioinformatics?",
    "options": ["Python", "HTML", "CSS", "JavaScript"],
    "correctAnswer": 0
  },
  {
    "id": 15,
    "question": "What is the main function of ribosomes?",
    "options": ["Protein synthesis", "DNA replication", "Energy production", "Cell movement"],
    "correctAnswer": 0
  },
  {
    "id": 16,
    "question": "Which of these is a common genome assembly algorithm?",
    "options": ["de Bruijn graph", "QuickSort", "Dijkstra's", "Binary search"],
    "correctAnswer": 0
  },
  {
    "id": 17,
    "question": "What does ORF stand for in genomics?",
    "options": ["Open Reading Frame", "Operational Research Function", "Organic Reaction Formula", "Optimal Reading Fragment"],
    "correctAnswer": 0
  },
  {
    "id": 18,
    "question": "Which of these is a common multiple sequence alignment tool?",
    "options": ["Clustal Omega", "Word", "Excel", "Photoshop"],
    "correctAnswer": 0
  },
  {
    "id": 19,
    "question": "What is the purpose of a dot plot in bioinformatics?",
    "options": ["Visualize sequence similarity", "Display protein 3D structure", "Count chromosomes", "Measure cell size"],
    "correctAnswer": 0
  },
  {
    "id": 20,
    "question": "Which of these is a common protein database?",
    "options": ["UniProt", "GenBank", "PubMed", "OMIM"],
    "correctAnswer": 0
  },
  {
    "id": 21,
    "question": "What does NGS stand for?",
    "options": ["Next-Generation Sequencing", "Nuclear Genetic System", "Nucleotide Grouping Standard", "National Genome Service"],
    "correctAnswer": 0
  },
  {
    "id": 22,
    "question": "Which of these is a common file format for storing protein structures?",
    "options": [".pdb", ".fasta", ".jpg", ".mp3"],
    "correctAnswer": 0
  },
  {
    "id": 23,
    "question": "What is the purpose of k-mers in genome assembly?",
    "options": ["Break sequences into smaller fragments for analysis", "Measure protein concentration", "Count cells", "Determine pH levels"],
    "correctAnswer": 0
  },
  {
    "id": 24,
    "question": "Which of these is a common RNA-Seq analysis tool?",
    "options": ["DESeq2", "Photoshop", "Excel", "Word"],
    "correctAnswer": 0
  },
  {
    "id": 25,
    "question": "What does ChIP-Seq analyze?",
    "options": ["Protein-DNA interactions", "RNA sequences", "Metabolic pathways", "Cell morphology"],
    "correctAnswer": 0
  },
  {
    "id": 26,
    "question": "Which of these is a common metagenomics analysis tool?",
    "options": ["QIIME", "Excel", "Word", "Photoshop"],
    "correctAnswer": 0
  },
  {
    "id": 27,
    "question": "What is the purpose of a hidden Markov model in bioinformatics?",
    "options": ["Pattern recognition in biological sequences", "3D protein visualization", "Cell counting", "pH measurement"],
    "correctAnswer": 0
  },
  {
    "id": 28,
    "question": "Which of these is a common gene ontology database?",
    "options": ["GO", "GenBank", "PubMed", "OMIM"],
    "correctAnswer": 0
  },
  {
    "id": 29,
    "question": "What does GWAS stand for?",
    "options": ["Genome-Wide Association Study", "Gene Weight Analysis System", "Global Web Alignment Server", "Genomic Workflow Assessment Standard"],
    "correctAnswer": 0
  },
  {
    "id": 30,
    "question": "Which of these is a common variant calling format?",
    "options": ["VCF", "JPEG", "MP3", "DOCX"],
    "correctAnswer": 0
  },
  {
    "id": 31,
    "question": "What is the purpose of the E-value in BLAST results?",
    "options": ["Measure statistical significance of matches", "Count sequence length", "Measure protein concentration", "Calculate pH"],
    "correctAnswer": 0
  },
  {
    "id": 32,
    "question": "Which of these is a common structural bioinformatics tool?",
    "options": ["PyMOL", "Excel", "Word", "Photoshop"],
    "correctAnswer": 0
  },
  {
    "id": 33,
    "question": "What does RMSD measure in protein structure comparison?",
    "options": ["Structural similarity", "Sequence length", "Molecular weight", "Isoelectric point"],
    "correctAnswer": 0
  },
  {
    "id": 34,
    "question": "Which of these is a common pathway analysis tool?",
    "options": ["KEGG", "Excel", "Word", "Photoshop"],
    "correctAnswer": 0
  },
  {
    "id": 35,
    "question": "What is the purpose of a read mapper in NGS analysis?",
    "options": ["Align sequences to a reference genome", "Count cells", "Measure protein concentration", "Determine pH"],
    "correctAnswer": 0
  },
  {
    "id": 36,
    "question": "Which of these is a common genome browser?",
    "options": ["UCSC Genome Browser", "Chrome", "Firefox", "Safari"],
    "correctAnswer": 0
  },
  {
    "id": 37,
    "question": "What does FPKM stand for in RNA-Seq?",
    "options": ["Fragments Per Kilobase of transcript per Million mapped reads", "Full Protein Kinase Measurement", "Functional Protein Kinetic Model", "Folded Protein Key Metric"],
    "correctAnswer": 0
  },
];

const timeOptions = [
  { seconds: 30, label: '30 Seconds', questionCount: 10, difficulty: 'Extreme' },
  { seconds: 60, label: '1 Minute', questionCount: 25, difficulty: 'Hard' },
  { seconds: 120, label: '2 Minutes', questionCount: 50, difficulty: 'Medium' },
  { seconds: 180, label: '3 Minutes', questionCount: 65, difficulty: 'Standard' }
];

const XP_THRESHOLDS = [
  { score: 200, xp: 5 },
  { score: 400, xp: 15 },
  { score: 600, xp: 40 },
  { score: 800, xp: 55 },
  { score: 1000, xp: 75 }
];

const formatGeminiResponse = (text) => {
  // Remove any markdown formatting and clean up the response
  let formatted = text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '')   // Remove italic markers
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)'); // Convert markdown links to plain text

  // Add emoji replacements for common patterns
  formatted = formatted
    .replace(/strengths:/gi, '💪 Strengths:')
    .replace(/weaknesses:/gi, '⚠️ Weaknesses:')
    .replace(/resources:/gi, '📚 Resources:')
    .replace(/next steps:/gi, '🚀 Next Steps:');

  return formatted;
};

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
  const [questions, setQuestions] = useState([]);
  const [selectedTimeOption, setSelectedTimeOption] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestions = (questionCount) => {
    const duplicatedQuestions = [];
    const repetitions = Math.ceil(questionCount / baseQuestions.length);
    
    for (let i = 0; i < repetitions; i++) {
      duplicatedQuestions.push(...baseQuestions.map(q => ({
        ...q,
        id: `${q.id}_${i}`
      })));
    }
    
    return shuffleArray(duplicatedQuestions).slice(0, questionCount);
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardRef = collection(db, "leaderboard");
        const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setLeaderboard(leaderboardData);

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
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isQuizStarted, isQuizComplete]);

  const handleTimeUp = () => {
    setIsQuizComplete(true);
    handleQuizComplete();
  };

  const calculateXP = (finalScore) => {
    let xpEarned = 0;
    for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (finalScore >= XP_THRESHOLDS[i].score) {
        xpEarned = XP_THRESHOLDS[i].xp;
        break;
      }
    }
    return xpEarned;
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setSelectedAnswers(prev => [...prev, answerIndex]);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      const timeBonus = Math.floor((timeLeft / quizTime) * 50);
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

  const analyzeResultsWithGemini = async () => {
    setIsAnalyzing(true);
    
    try {
      const quizData = {
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / (questions.length * 100)) * 100),
        timeTaken: selectedTimeOption.seconds - timeLeft,
        difficulty: selectedTimeOption.difficulty,
        xpEarned: earnedXP,
        questions: questions.map((q, i) => ({
          question: q.question,
          correctAnswer: q.options[q.correctAnswer],
          userAnswer: selectedAnswers[i] !== undefined ? q.options[selectedAnswers[i]] : null,
          isCorrect: selectedAnswers[i] === q.correctAnswer
        }))
      };

      const prompt = `
        You're a fun, game-like AI tutor analyzing a bioinformatics quiz. The player scored ${quizData.score} points (${quizData.percentage}%) in ${quizData.difficulty} mode.

        Give a SHORT, EXCITING analysis (3-4 sentences max) with:
        1. A hype message about their score
        2. One key strength (emoji)
        3. One area to improve (emoji)
        4. One cool resource to check out
        5. Keep it casual and fun - no formatting or bullet points!

        Example: "Nice score! 🎉 You crushed it on sequence alignment! 🧬 Try Khan Academy's genetics videos to boost your DNA knowledge. Keep leveling up! 💪"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeminiAnalysis(formatGeminiResponse(text));
    } catch (error) {
      console.error("AI analysis error:", error);
      setGeminiAnalysis("Game analysis failed - but great effort! Try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuizComplete = async () => {
    const xpEarned = calculateXP(score);
    setEarnedXP(xpEarned);
    setShowXPAnimation(true);
    
    if (!user) {
      setError('You must be logged in to save your score');
      return;
    }

    try {
      const timeTaken = quizTime - timeLeft;
      const timeOption = timeOptions.find(opt => opt.seconds === quizTime);
      
      const userDocRef = doc(db, "leaderboard", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const newScore = {
        userId: user.uid,
        name: user.displayName || 'Anonymous',
        score,
        time: timeTaken,
        timeLimit: quizTime,
        timeOption: timeOption.label,
        difficulty: timeOption.difficulty,
        timestamp: Timestamp.now(),
        xpEarned,
        questionCount: questions.length
      };

      if (!userDocSnap.exists() || userDocSnap.data().score < score) {
        await setDoc(userDocRef, newScore);
        setUserBestScore(score);
      }

      const userProfileRef = doc(db, "users", user.uid);
      await updateDoc(userProfileRef, {
        xp: increment(xpEarned),
        lastLogin: new Date().toISOString(),
        achievementsUnlocked: arrayUnion({
          name: `Scored ${score} in ${timeOption.difficulty} challenge`,
          timestamp: Timestamp.now(),
          xp: xpEarned
        })
      });

      const leaderboardRef = collection(db, "leaderboard");
      const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaderboard(leaderboardData);

      await analyzeResultsWithGemini();
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save your score');
    } finally {
      setTimeout(() => setShowXPAnimation(false), 3000);
    }
  };

  const handleTimeSelect = (option) => {
    const generatedQuestions = generateQuestions(option.questionCount);
    setQuestions(generatedQuestions);
    setQuizTime(option.seconds);
    setTimeLeft(option.seconds);
    setSelectedTimeOption(option);
    setIsTimeSelected(true);
    setIsQuizStarted(true);
    setError(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsQuizComplete(false);
    setEarnedXP(0);
    setGeminiAnalysis(null);
    setSelectedAnswers([]);
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
    setEarnedXP(0);
    setGeminiAnalysis(null);
    setSelectedAnswers([]);
  };

  const getTimeOptionColor = (seconds) => {
    switch (seconds) {
      case 30: return 'bg-red-500/20 border-red-500/30';
      case 60: return 'bg-orange-500/20 border-orange-500/30';
      case 120: return 'bg-yellow-500/20 border-yellow-500/30';
      case 180: return 'bg-green-500/20 border-green-500/30';
      default: return 'bg-indigo-500/20 border-indigo-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2"
          >
            <Brain className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl md:text-3xl font-bold">GeQuefy Challenge</h1>
          </motion.div>
          {isQuizStarted && (
            <div className="flex items-center space-x-4 md:space-x-6">
              <motion.div
                animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: timeLeft < 10 ? Infinity : 0, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Timer className={`w-5 h-5 md:w-6 md:h-6 ${timeLeft < 10 ? 'text-red-400' : 'text-indigo-400'}`} />
                <span className="text-lg md:text-xl font-mono">{formatTime(timeLeft)}</span>
              </motion.div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                <span className="text-lg md:text-xl">{score}</span>
              </div>
              {showXPAnimation && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  <span className="text-lg md:text-xl">+{earnedXP} XP</span>
                </motion.div>
              )}
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
            <h2 className="text-2xl font-bold mb-6">Select Challenge Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeOptions.map((option) => (
                <motion.button
                  key={option.seconds}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTimeSelect(option)}
                  className={`p-4 rounded-lg transition-colors border ${getTimeOptionColor(option.seconds)} hover:bg-opacity-30`}
                >
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{option.label}</h3>
                    <p className="text-sm text-gray-400">
                      {option.questionCount} questions • {option.difficulty}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      Max XP: {XP_THRESHOLDS.find(t => t.score <= option.questionCount * 100)?.xp || 0}
                    </div>
                  </div>
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
                <h2 className="text-xl font-semibold">
                  Question {currentQuestion + 1} of {questions.length} ({selectedTimeOption.difficulty})
                </h2>
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
            className="bg-navy-900 rounded-xl p-8 border border-indigo-500/20"
          >
            <div className="flex flex-col items-center">
              <Trophy className="w-16 h-16 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
              <p className="text-lg mb-1">Final Score: {score} points</p>
              <p className="text-gray-400 mb-4">
                {selectedTimeOption.label} • {selectedTimeOption.difficulty}
              </p>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-indigo-300">XP Earned:</span>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">+{earnedXP} XP</span>
                  </div>
                </div>
              </motion.div>

              <div className="w-full mt-6 text-left">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                  Performance Breakdown
                </h3>
                
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-400">Generating your battle report...</p>
                  </div>
                ) : geminiAnalysis ? (
                  <div className="bg-navy-800/50 p-4 rounded-lg border border-indigo-500/20">
                    <p className="whitespace-pre-line">{geminiAnalysis}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Analysis not available
                  </p>
                )}
              </div>

              <button
                onClick={restartQuiz}
                className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Play Again
              </button>
            </div>
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
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  entry.userId === user?.uid 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'bg-navy-800 border-indigo-500/20'
                }`}
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
                  <div className="text-right">
                    <span className="font-semibold block">{entry.score} pts</span>
                    <span className="text-xs text-gray-400">{entry.timeOption}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{entry.xpEarned || 0}</span>
                  </div>
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