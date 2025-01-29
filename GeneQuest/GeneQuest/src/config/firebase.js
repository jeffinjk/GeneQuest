import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDyw1K_ejKryZZz8QEG-z0XASf7kLvXFsY",
    authDomain: "genequest-2a0a4.firebaseapp.com",
    projectId: "genequest-2a0a4",
    storageBucket: "genequest-2a0a4.firebasestorage.app",
    messagingSenderId: "62476610972",
    appId: "1:62476610972:web:012cdf7e34e1f2b7e6ac59",
    measurementId: "G-PCFPPVHHCC"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);