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
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from '../Chatbot';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const Sidebar = ({ isMobile = false }) => (
    <nav className="mt-6">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          onClick={isMobile ? closeMobileMenu : undefined}
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
  );

  return (
    <div className="flex h-screen bg-cyan-900 text-white">
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:block w-64 bg-blue-950 border-r border-indigo-500/20"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-400">GeneQuest</h1>
        </div>
        <Sidebar />
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-950 rounded-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={closeMobileMenu} />
            <div className="absolute inset-y-0 left-0 w-64 bg-blue-950 border-r border-indigo-500/20">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-400">GeneQuest</h1>
              </div>
              <Sidebar isMobile={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="bg-gray-800 flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>

      {/* Chatbot */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;