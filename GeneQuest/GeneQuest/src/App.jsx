import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashboardLayout from './components/layout/DashboardLayout';
import Visualize from './pages/dashboard/Visualize';
import Modules from './pages/dashboard/Modules';
import SkillMeasure from './pages/dashboard/SkillMeasure';
import GeQuefy from './pages/dashboard/GeQuefy';
import TalkShelf from './pages/dashboard/TalkShelf';
import Profile from './pages/dashboard/Profile';
import { useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="visualize" element={<Visualize />} />
            <Route path="modules" element={<Modules />} />
            <Route path="skills" element={<SkillMeasure />} />
            <Route path="gequefy" element={<GeQuefy />} />
            <Route path="talkshelf" element={<TalkShelf />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<Navigate to="/dashboard/visualize" replace />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;