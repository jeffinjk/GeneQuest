import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Baby, 
  Rocket, 
  Brain, 
  Trophy,
  Star,
  Lock,
  CheckCircle2,
  Timer,
  Target,
  Medal
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; // Adjust the path to your Firebase config

const levels = [
  {
    id: 'noobie',
    title: 'Noobie',
    icon: Baby,
    color: 'from-blue-400 to-blue-600',
    requirements: [
      'Complete introduction module',
      'Upload first sequence file',
      'View 2D visualization'
    ],
    xpRequired: 100
  },
  {
    id: 'starter',
    title: 'Starter',
    icon: Rocket,
    color: 'from-green-400 to-green-600',
    requirements: [
      'Complete 2D visualization module',
      'Analyze 3 different sequences',
      'Use basic analysis tools'
    ],
    xpRequired: 300
  },
  {
    id: 'gene-explorer',
    title: 'Gene Explorer',
    icon: Brain,
    color: 'from-purple-400 to-purple-600',
    requirements: [
      'Master 3D visualization',
      'Complete pattern recognition module',
      'Analyze complex sequences'
    ],
    xpRequired: 600
  },
  {
    id: 'visualizer',
    title: 'Visualizer',
    icon: Trophy,
    color: 'from-yellow-400 to-yellow-600',
    requirements: [
      'Complete all modules',
      'Create custom visualizations',
      'Help other users'
    ],
    xpRequired: 1500
  }
];

const SkillMeasure = () => {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('noobie');
  const [user, setUser] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch XP and rank from Firestore
  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCurrentXP(userData.xp || 0);
      setCurrentLevel(getCurrentRank(userData.xp || 0)); // Calculate rank based on XP
    }
  };

  // Calculate rank based on XP
  const getCurrentRank = (xp) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xpRequired) {
        return levels[i].id;
      }
    }
    return 'noobie'; // Default rank
  };

  // Update rank in Firestore if XP changes
  useEffect(() => {
    if (user) {
      const newRank = getCurrentRank(currentXP);
      if (newRank !== currentLevel) {
        setCurrentLevel(newRank);
        updateRankInFirestore(user.uid, newRank);
      }
    }
  }, [currentXP, user]);

  // Update rank in Firestore
  const updateRankInFirestore = async (userId, rank) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      rank: rank,
    });
  };

  const getCurrentLevelIndex = () => {
    return levels.findIndex(level => level.id === currentLevel);
  };

  const getProgressToNextLevel = () => {
    const currentLevelObj = levels[getCurrentLevelIndex()];
    const nextLevelObj = levels[getCurrentLevelIndex() + 1];
    
    if (!nextLevelObj) return 100;
    
    const xpForCurrentLevel = currentLevelObj.xpRequired;
    const xpForNextLevel = nextLevelObj.xpRequired;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpRequired = xpForNextLevel - xpForCurrentLevel;
    
    return (xpProgress / xpRequired) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Medal className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Skill Progress</h1>
        </div>

        {/* Current Level Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`p-3 rounded-lg bg-gradient-to-br ${levels[getCurrentLevelIndex()].color}`}
              >
                {React.createElement(levels[getCurrentLevelIndex()].icon, { className: "w-8 h-8 text-white" })}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {levels[getCurrentLevelIndex()].title}
                </h2>
                <p className="text-gray-400">Current Level</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{currentXP} XP</p>
              <p className="text-gray-400">Total Experience</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressToNextLevel()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${levels[getCurrentLevelIndex()].color}`}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Goals</h3>
              </div>
              <p className="text-2xl font-bold text-white">5/8</p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">Time</h3>
              </div>
              <p className="text-2xl font-bold text-white">12h</p>
              <p className="text-gray-400 text-sm">Learning Time</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-semibold">Achievements</h3>
              </div>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-gray-400 text-sm">Unlocked</p>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="grid gap-6">
          {levels.map((level, index) => {
            const isCurrentLevel = level.id === currentLevel;
            const isPastLevel = index < getCurrentLevelIndex();
            const isLocked = index > getCurrentLevelIndex();

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800 rounded-lg p-6 ${
                  isCurrentLevel ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`p-3 rounded-lg bg-gradient-to-br ${level.color} ${
                      isLocked ? 'opacity-50' : ''
                    }`}
                  >
                    <level.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {level.title}
                      {isPastLevel && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {isLocked && <Lock className="w-5 h-5 text-gray-500" />}
                    </h3>
                    <p className="text-gray-400">
                      {isLocked
                        ? `Unlock at ${level.xpRequired} XP`
                        : `${level.xpRequired} XP Required`}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {level.requirements.map((req, reqIndex) => (
                    <div
                      key={reqIndex}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPastLevel || isCurrentLevel
                            ? 'bg-green-400'
                            : 'bg-gray-600'
                        }`}
                      />
                      {req}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillMeasure;