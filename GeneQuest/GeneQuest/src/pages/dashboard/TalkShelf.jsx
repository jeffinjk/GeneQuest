import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquarePlus, 
  Users, 
  Send, 
  Plus,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
  getDoc
} from 'firebase/firestore';

const TalkShelf = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    description: '',
    topic: ''
  });
  const [joinRequests, setJoinRequests] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('joined');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all rooms and separate them into joined and available
  useEffect(() => {
    if (!user) return;

    // Get rooms where user is a member
    const joinedRoomsQuery = query(
      collection(db, 'chatRooms'),
      where('members', 'array-contains', user.uid)
    );

    // Get all rooms
    const allRoomsQuery = query(collection(db, 'chatRooms'));

    const unsubscribeJoined = onSnapshot(joinedRoomsQuery, (snapshot) => {
      const joinedRoomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(joinedRoomsData);
    });

    const unsubscribeAll = onSnapshot(allRoomsQuery, (snapshot) => {
      const allRoomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter out rooms the user is already a member of
      const availableRoomsData = allRoomsData.filter(
        room => !room.members.includes(user.uid)
      );
      setAvailableRooms(availableRoomsData);
      setLoading(false);
    });

    return () => {
      unsubscribeJoined();
      unsubscribeAll();
    };
  }, [user]);

  // Fetch join requests for rooms created by user
  useEffect(() => {
    if (!user) return;

    const requestsQuery = query(
      collection(db, 'joinRequests'),
      where('status', '==', 'pending'),
      where('createdBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJoinRequests(requestsData);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for messages in selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const messagesQuery = query(
      collection(db, `chatRooms/${selectedRoom.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const createRoom = async () => {
    if (!user) return;
    
    try {
      const roomRef = await addDoc(collection(db, 'chatRooms'), {
        ...newRoomData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid],
        pendingMembers: []
      });

      setShowCreateRoom(false);
      setNewRoomData({ name: '', description: '', topic: '' });
      setSelectedRoom({
        id: roomRef.id,
        ...newRoomData,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        members: [user.uid],
        pendingMembers: [],
        messages: []
      });
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room');
    }
  };

  const joinRoom = async (roomId) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'joinRequests'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        roomId,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      setError('Join request sent! Waiting for admin approval.');
    } catch (err) {
      console.error('Error requesting to join room:', err);
      setError('Failed to request room access');
    }
  };

  const handleJoinRequest = async (requestId, approved) => {
    if (!user) return;

    try {
      const requestRef = doc(db, 'joinRequests', requestId);
      const request = (await getDoc(requestRef)).data();

      await updateDoc(requestRef, {
        status: approved ? 'approved' : 'rejected'
      });

      if (approved) {
        const roomRef = doc(db, 'chatRooms', request.roomId);
        await updateDoc(roomRef, {
          members: arrayUnion(request.userId),
          pendingMembers: arrayRemove(request.userId)
        });
      }
    } catch (err) {
      console.error('Error handling join request:', err);
      setError('Failed to process join request');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedRoom || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, `chatRooms/${selectedRoom.id}/messages`), {
        content: newMessage,
        sender: user.uid,
        senderName: user.displayName || 'Anonymous',
        timestamp: timestamp.now()
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-navy-950 text-white">
      <div className="h-full flex">
        {/* Sidebar */}
        <div className="w-80 bg-navy-900 border-r border-indigo-500/20 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Communities</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="p-2 hover:bg-navy-800 rounded-full transition-colors"
            >
              <Plus className="h-5 w-5 text-indigo-400" />
            </button>
          </div>

          {/* Room Tabs */}
          <div className="flex mb-4 bg-navy-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('joined')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                activeTab === 'joined'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Joined
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                activeTab === 'available'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Available
            </button>
          </div>

          {/* Room List */}
          <div className="space-y-2">
            {activeTab === 'joined' ? (
              rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-indigo-600/20 border border-indigo-500/20'
                      : 'hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-indigo-400" />
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-400">{room.topic}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              availableRooms.map(room => (
                <div
                  key={room.id}
                  className="w-full p-3 rounded-lg text-left transition-colors hover:bg-navy-800 border border-indigo-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-indigo-400" />
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-gray-400">{room.topic}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => joinRoom(room.id)}
                      className="p-2 hover:bg-indigo-600/20 rounded-full transition-colors"
                    >
                      <UserPlus className="h-5 w-5 text-indigo-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Join Requests Section */}
          {joinRequests.length > 0 && activeTab === 'joined' && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
              <div className="space-y-3">
                {joinRequests.map(request => (
                  <div
                    key={request.id}
                    className="bg-navy-800 p-3 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{request.userName}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleJoinRequest(request.id, true)}
                          className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </button>
                        <button
                          onClick={() => handleJoinRequest(request.id, false)}
                          className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Requested {new Date(request.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              {/* Room Header */}
              <div className="bg-navy-900 border-b border-indigo-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
                    <p className="text-sm text-gray-400">{selectedRoom.topic}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span>{selectedRoom.members.length} members</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === user?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === user?.uid
                          ? 'bg-indigo-600/20 border border-indigo-500/20'
                          : 'bg-navy-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.sender === user?.uid ? 'You' : message.senderName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 bg-navy-900 border-t border-indigo-500/20">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-navy-800 border border-indigo-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquarePlus className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No Room Selected</h2>
                <p className="text-gray-400">
                  Select a room to start chatting or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-navy-900 rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Room</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  className="w-full bg-navy-800 border border-indigo-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={newRoomData.topic}
                  onChange={(e) => setNewRoomData({ ...newRoomData, topic: e.target.value })}
                  className="w-full bg-navy-800 border border-indigo-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter room topic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={newRoomData.description}
                  onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                  className="w-full bg-navy-800 border border-indigo-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter room description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                disabled={!newRoomData.name || !newRoomData.topic}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TalkShelf;