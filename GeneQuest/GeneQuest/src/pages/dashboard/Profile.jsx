import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Calendar, Trophy, BookOpen } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200');
  const [isEditing, setIsEditing] = useState(false);

  const userStats = {
    dateJoined: user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A',
    currentModule: 'DNA Structure and Function',
    currentRank: 'Gene Explorer',
    progress: 65,
    completedModules: 3,
    totalModules: 10
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement photo upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameUpdate = () => {
    // TODO: Implement name update in Firebase Auth
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-navy-900 rounded-xl p-8 border border-indigo-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img
              src={photoURL}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="h-8 w-8 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-navy-800 text-white text-2xl font-bold px-4 py-2 rounded-lg border border-indigo-500/20"
                  onBlur={handleNameUpdate}
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">
                  {displayName || 'Add your name'}
                </h1>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-400 hover:text-indigo-300"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Joined {userStats.dateJoined}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-navy-900 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Current Progress</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Current Module</span>
                <span>{userStats.currentModule}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${userStats.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Completed Modules</span>
              <span>{userStats.completedModules} / {userStats.totalModules}</span>
            </div>
          </div>
        </div>

        <div className="bg-navy-900 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Current Rank</h2>
          </div>
          <div className="text-center">
            <div className="inline-block p-4 bg-indigo-600/20 rounded-full mb-4">
              <Trophy className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {userStats.currentRank}
            </h3>
            <p className="text-gray-400 text-sm">
              Keep learning to unlock the next rank!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;