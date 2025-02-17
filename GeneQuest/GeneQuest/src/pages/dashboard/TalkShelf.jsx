import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageSquarePlus,
  Users,
  Send,
  Plus,
  MessageSquare,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const TalkShelf = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    description: "",
    topic: "",
  });
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all rooms
  useEffect(() => {
    if (!user) return;

    const roomsQuery = query(
      collection(db, "chatRooms"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        members: doc.data().members || [],
      }));
      setRooms(roomsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for messages in selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const messagesQuery = query(
      collection(db, `chatRooms/${selectedRoom.id}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const createRoom = async () => {
    if (!user) return;

    try {
      const roomRef = await addDoc(collection(db, "chatRooms"), {
        ...newRoomData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid],
        memberCount: 1,
      });

      setShowCreateRoom(false);
      setNewRoomData({ name: "", description: "", topic: "" });
      setSelectedRoom({
        id: roomRef.id,
        ...newRoomData,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        members: [user.uid],
        memberCount: 1,
      });
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room");
    }
  };

  const joinRoom = async (roomId) => {
    if (!user) return;

    try {
      const roomRef = doc(db, "chatRooms", roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid),
        memberCount: (selectedRoom.memberCount || 0) + 1,
      });

      // Update the selected room with the new member
      setSelectedRoom((prev) => ({
        ...prev,
        members: [...prev.members, user.uid],
        memberCount: (prev.memberCount || 0) + 1,
      }));
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room");
    }
  };

  const leaveRoom = async (roomId) => {
    if (!user) return;

    try {
      const roomRef = doc(db, "chatRooms", roomId);
      await updateDoc(roomRef, {
        members: arrayRemove(user.uid),
        memberCount: Math.max(0, (selectedRoom.memberCount || 1) - 1),
      });

      // Update the selected room without the member
      setSelectedRoom((prev) => ({
        ...prev,
        members: prev.members.filter((id) => id !== user.uid),
        memberCount: Math.max(0, (prev.memberCount || 1) - 1),
      }));
    } catch (err) {
      console.error("Error leaving room:", err);
      setError("Failed to leave room");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedRoom || !newMessage.trim()) return;

    // Check if user is a member of the room
    if (!selectedRoom.members.includes(user.uid)) {
      setError("You must join the room before sending messages");
      return;
    }

    try {
      await addDoc(collection(db, `chatRooms/${selectedRoom.id}/messages`), {
        content: newMessage,
        sender: user.uid,
        senderName: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const isUserMember = (room) => {
    return room.members.includes(user?.uid);
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
            <h2 className="text-xl font-bold">Chat Rooms</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="p-2 hover:bg-navy-800 rounded-full transition-colors"
            >
              <Plus className="h-5 w-5 text-indigo-400" />
            </button>
          </div>

          {/* Room List */}
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedRoom?.id === room.id
                    ? "bg-indigo-600/20 border border-indigo-500/20"
                    : "hover:bg-navy-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                  <div className="flex-1">
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-400">{room.topic}</p>
                  </div>
                  {isUserMember(room) && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                      Joined
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-indigo-400" />
                      <span>{selectedRoom.memberCount || 0} members</span>
                    </div>
                    {!isUserMember(selectedRoom) ? (
                      <button
                        onClick={() => joinRoom(selectedRoom.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Join Room</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => leaveRoom(selectedRoom.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Leave</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!isUserMember(selectedRoom) ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <UserPlus className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                      <h2 className="text-xl font-bold mb-2">Join to Chat</h2>
                      <p className="text-gray-400 mb-4">
                        You need to join this room to send and view messages
                      </p>
                      <button
                        onClick={() => joinRoom(selectedRoom.id)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === user?.uid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === user?.uid
                              ? "bg-indigo-600/20 border border-indigo-500/20"
                              : "bg-navy-800"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">
                              {message.sender === user?.uid
                                ? "You"
                                : message.senderName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp?.toDate().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              {isUserMember(selectedRoom) && (
                <form
                  onSubmit={sendMessage}
                  className="p-4 bg-navy-900 border-t border-indigo-500/20"
                >
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
              )}
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
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
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
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, topic: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewRoomData({
                      ...newRoomData,
                      description: e.target.value,
                    })
                  }
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

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default TalkShelf;