import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  const [sessionTimer, setSessionTimer] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the session has expired
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const lastLogin = userDoc.data()?.lastLogin;
        const sessionDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

        if (lastLogin && (new Date() - new Date(lastLogin)) > sessionDuration) {
          // Session expired, log the user out
          await logout();
        } else {
          // Session is still valid, set the user
          setUser(user);
          // Set a timer to log the user out after the remaining session time
          const remainingTime = sessionDuration - (new Date() - new Date(lastLogin));
          setSessionTimer(setTimeout(logout, remainingTime));
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, []);

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
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
        completedModules: 0,
        totalModules: 10,
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
      await setDoc(userDoc, {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Set a timer to log the user out after 10 minutes
      
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (sessionTimer) clearTimeout(sessionTimer);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
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
                  ease: "easeInOut"
                }
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
              repeatType: "reverse"
            }
          }}
        >
          Loading your genetic adventure...
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};