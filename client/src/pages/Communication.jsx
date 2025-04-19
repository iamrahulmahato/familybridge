import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Communication = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩',
      lastMessage: 'Can you pick up the medication tomorrow?',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      name: 'Dr. Smith',
      avatar: '👨‍⚕️',
      lastMessage: 'Your test results are ready',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 3,
      name: 'Family Group',
      avatar: '👨‍👩‍👧‍👦',
      lastMessage: 'Meeting scheduled for next week',
      time: '2 days ago',
      unread: false,
    },
  ];

  const messages = {
    1: [
      { id: 1, sender: 'Sarah Johnson', content: 'Can you pick up the medication tomorrow?', time: '2 hours ago' },
      { id: 2, sender: 'You', content: 'Yes, I can do that. What time?', time: '1 hour ago' },
      { id: 3, sender: 'Sarah Johnson', content: 'Anytime before 5 PM would be great', time: '30 minutes ago' },
    ],
    2: [
      { id: 1, sender: 'Dr. Smith', content: 'Your test results are ready', time: '1 day ago' },
      { id: 2, sender: 'You', content: 'Thank you, I\'ll schedule an appointment to discuss them', time: '1 day ago' },
    ],
    3: [
      { id: 1, sender: 'Mom', content: 'Meeting scheduled for next week', time: '2 days ago' },
      { id: 2, sender: 'You', content: 'What time?', time: '2 days ago' },
      { id: 3, sender: 'Dad', content: 'Tuesday at 3 PM', time: '2 days ago' },
    ],
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    // TODO: Implement message sending logic
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto"
      >
        {/* Chat List */}
        <div className="w-1/3 card mr-4">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-secondary)]">Chats</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveChat(chat.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  activeChat === chat.id 
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                    : 'hover:bg-[var(--color-background-alt)] text-[var(--color-secondary)]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-background-alt)] flex items-center justify-center text-xl mr-3">
                  {chat.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{chat.name}</h3>
                    <span className="text-sm text-[var(--color-secondary)]/50">{chat.time}</span>
                  </div>
                  <p className="text-sm text-[var(--color-secondary)]/70 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] ml-2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 card flex flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[var(--color-background-alt)]">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-background-alt)] flex items-center justify-center text-xl mr-3">
                    {chats.find(chat => chat.id === activeChat)?.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-secondary)]">
                      {chats.find(chat => chat.id === activeChat)?.name}
                    </h3>
                    <p className="text-sm text-[var(--color-secondary)]/50">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages[activeChat]?.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`flex ${
                        msg.sender === 'You' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'You'
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-background-alt)] text-[var(--color-secondary)]'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[var(--color-background-alt)]">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-secondary)]/50">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Communication; 