import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set the user
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        name,
        email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        currentModule: 'DNA Structure and Function',
        currentRank: 'Gene Explorer',
        progress: 0,
        completedModules: [],
        totalModules: 10,
        xp: 0, // Initialize XP to 0
        goalsCompleted: 0, // Initialize goalsCompleted
        achievementsUnlocked: 0, // Initialize achievementsUnlocked
        learningTime: 0, // Initialize learningTime
      });
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Update last login in Firestore
      const userDoc = doc(db, 'users', userCredential.user.uid);
      await setDoc(
        userDoc,
        {
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserXP = async (userId, newXp) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        xp: newXp,
      });
    } catch (error) {
      console.error('Error updating XP:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUserXP,
    loading,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {'GeneQuest'.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ y: 0 }}
              animate={{
                y: [-20, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                },
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          className="mt-4 text-indigo-300 text-sm"
          initial={{ opacity: 0.5 }}
          animate={{
            opacity: 1,
            transition: {
              repeat: Infinity,
              duration: 1.5,
              repeatType: 'reverse',
            },
          }}
        >
          Loading your genetic adventure...
        </motion.div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};