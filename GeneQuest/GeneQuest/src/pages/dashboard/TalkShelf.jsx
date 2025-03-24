import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus,
  Users,
  Send,
  Plus,
  MessageSquare,
  UserPlus,
  X,
  MessageCircleMore,
  Info,
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
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TalkShelf = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
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
  const [activeTab, setActiveTab] = useState("joined");
  const [isTyping, setIsTyping] = useState(false);
  const [factChecks, setFactChecks] = useState([]); // Store fact-check results
  const [visibleFactChecks, setVisibleFactChecks] = useState({}); // Track visibility of fact-checks
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Gemini AI setup
  const genAI = new GoogleGenerativeAI("AIzaSyD8MOM0pxVrdRpw5sKeC0pgJRCZXtPGWbY");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Trigger keywords for fact-checking
  const triggerKeywords = new Set([
    "gene",
    "bioinformatics",
    "DNA",
    "RNA",
    "genome",
    "mutation",
    "protein",
    "sequence",
  ]);

  // Check if a message contains trigger keywords
  const containsTriggerKeywords = (message) => {
    const words = message.toLowerCase().split(/\s+/);
    return words.some((word) => triggerKeywords.has(word));
  };

  // Fact-check a message using Gemini
  const factCheckMessage = async (message) => {
    try {
      const prompt = `You are a fact-checking assistant. Analyze the following message and provide a fact-checked response. If the message contains accurate information, confirm it. If it contains inaccuracies, correct them. Respond concisely and clearly: "${message}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const factCheckResponse = await response.text();
      return factCheckResponse;
    } catch (error) {
      console.error("Error fetching fact-check response:", error);
      return "Unable to fact-check this message. Please try again later.";
    }
  };

  // Store fact-check result in Firestore
  const storeFactCheck = async (roomId, message, factCheckResponse) => {
    try {
      await addDoc(collection(db, `chatRooms/${roomId}/factChecks`), {
        originalMessage: message,
        factCheckResponse: factCheckResponse,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error storing fact-check result:", error);
    }
  };

  // Send message and trigger fact-checking if keywords are found
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedRoom || !newMessage.trim()) return;

    try {
      // Send the user's message
      const messageRef = await addDoc(collection(db, `chatRooms/${selectedRoom.id}/messages`), {
        content: newMessage,
        sender: user.uid,
        senderName: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
      });

      // Check for trigger keywords and fact-check the message
      if (containsTriggerKeywords(newMessage)) {
        setIsTyping(true);
        const factCheckResponse = await factCheckMessage(newMessage);
        if (factCheckResponse) {
          await storeFactCheck(selectedRoom.id, newMessage, factCheckResponse);
          setFactChecks((prev) => [
            ...prev,
            { id: messageRef.id, originalMessage: newMessage, factCheckResponse: factCheckResponse },
          ]);
        }
        setIsTyping(false);
      }

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // Fetch fact-checks for the selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const factChecksQuery = query(
      collection(db, `chatRooms/${selectedRoom.id}/factChecks`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(factChecksQuery, (snapshot) => {
      const checks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFactChecks(checks);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  // Scroll to bottom when messages or fact-checks change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, factChecks]);

  // Toggle visibility of a fact-check
  const toggleFactCheckVisibility = (id) => {
    setVisibleFactChecks((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle visibility for the specific fact-check
    }));
  };

  // Fetch joined and available rooms
  useEffect(() => {
    if (!user) return;

    const joinedRoomsQuery = query(
      collection(db, "chatRooms"),
      where("members", "array-contains", user.uid)
    );

    const allRoomsQuery = query(collection(db, "chatRooms"));

    const unsubscribeJoined = onSnapshot(joinedRoomsQuery, (snapshot) => {
      const joinedRoomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(joinedRoomsData);
    });

    const unsubscribeAll = onSnapshot(allRoomsQuery, (snapshot) => {
      const allRoomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const availableRoomsData = allRoomsData.filter(
        (room) => !room.members.includes(user.uid)
      );
      setAvailableRooms(availableRoomsData);
      setLoading(false);
    });

    return () => {
      unsubscribeJoined();
      unsubscribeAll();
    };
  }, [user]);

  // Fetch messages for the selected room
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

  // Create a new room
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

  // Join a room
  const joinRoom = async (roomId) => {
    if (!user) return;

    try {
      const roomRef = doc(db, "chatRooms", roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid),
        memberCount: (selectedRoom.memberCount || 0) + 1,
      });
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room");
    }
  };

  // Leave a room
  const leaveRoom = async (roomId) => {
    if (!user) return;

    try {
      const roomRef = doc(db, "chatRooms", roomId);
      await updateDoc(roomRef, {
        members: arrayRemove(user.uid),
        memberCount: Math.max(0, (selectedRoom.memberCount || 1) - 1),
      });

      setSelectedRoom(null);
    } catch (err) {
      console.error("Error leaving room:", err);
      setError("Failed to leave room");
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

          <div className="flex mb-4 bg-navy-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("joined")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                activeTab === "joined"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Joined
            </button>
            <button
              onClick={() => setActiveTab("available")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                activeTab === "available"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Available
            </button>
          </div>

          <div className="space-y-2">
            {activeTab === "joined"
              ? rooms.map((room) => (
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
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-gray-400">{room.topic}</p>
                      </div>
                    </div>
                  </button>
                ))
              : availableRooms.map((room) => (
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
                ))}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 12rem)" }}>
                <div className="space-y-4">
                  {messages.map((message) => {
                    const factCheck = factChecks.find((fc) => fc.originalMessage === message.content);
                    return (
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
                            {factCheck && (
                              <button
                                onClick={() => toggleFactCheckVisibility(message.id)}
                                className="p-1 hover:bg-indigo-600/20 rounded-full transition-colors"
                              >
                                <Info className="h-4 w-4 text-indigo-400" />
                              </button>
                            )}
                          </div>
                          <p>{message.content}</p>
                          {factCheck && visibleFactChecks[message.id] && (
                            <div className="mt-2 p-3 bg-navy-700 rounded-lg">
                              <span className="font-medium">Fact-Check:</span>{" "}
                              {factCheck.factCheckResponse}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="mb-4 bg-indigo-500/10 rounded-lg p-3">
                      <MessageCircleMore className="text-white" />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message input */}
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
    </div>
  );
};

export default TalkShelf;