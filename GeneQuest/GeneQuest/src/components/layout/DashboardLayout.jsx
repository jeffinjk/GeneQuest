import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Dna, 
  BookOpen, 
  Trophy, 
  GamepadIcon, 
  MessagesSquare, 
  LogOut, 
  UserCircle,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Chatbot from '../Chatbot';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const navItems = [
    { path: 'visualize', icon: Dna, label: 'Visualize' },
    { path: 'modules', icon: BookOpen, label: 'Modules' },
    { path: 'skills', icon: Trophy, label: 'Skill - Map' },
    { path: 'gequefy', icon: GamepadIcon, label: 'GeQuefy' },
    { path: 'talkshelf', icon: MessagesSquare, label: 'TalkShelf' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-cyan-900 text-white">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-blue-950 border-r border-indigo-500/20"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-400">GeneQuest</h1>
        </div>
        <nav className="mt-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 border-r-4 border-indigo-500 text-indigo-400'
                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 bg-blue-950 border-b border-indigo-500/20 flex items-center justify-end px-6"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 hover:bg-navy-800 rounded-full transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-gray-400" />
            </button>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `p-2 hover:bg-navy-800 rounded-full transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-gray-400'
                }`
              }
            >
              <UserCircle className="h-6 w-6" />
            </NavLink>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-navy-800 rounded-full transition-colors text-gray-400"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </motion.div>

        {/* Page content */}
        <div className=" bg-gray-800 flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>

      {/* Chatbot */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;