const ChatRoom = {
    id: '',
    name: '',
    description: '',
    createdBy: '',
    createdAt: '',
    topic: '',
    members: [],
    pendingMembers: [],
    lastMessage: {
      content: '',
      sender: '',
      timestamp: ''
    }
  };
  
  const ChatMessage = {
    id: '',
    content: '',
    sender: '',
    senderName: '',
    timestamp: '',
    roomId: '',
    read: false
  };
  
  const JoinRequest = {
    id: '',
    userId: '',
    userName: '',
    roomId: '',
    timestamp: '',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    createdBy: ''
  };