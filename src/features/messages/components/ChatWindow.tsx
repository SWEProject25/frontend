'use client';
import { useState } from 'react';
import { Info, Image, Smile, Send } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const [message, setMessage] = useState('');

  // Mock data - replace with real data
  const conversation = {
    name: 'Every Movie Plug',
    username: 'everymovieplug',
    avatar: 'https://avatar.iran.liara.run/public/8',
    verified: true,
  };

  const messages = [
    {
      id: '1',
      sender: 'them',
      text: 'Hey! Thanks for following!',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'No problem! Love your content',
      timestamp: '2:31 PM',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black w-full h-full">
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-white">{conversation.name}</h3>
                {conversation.verified && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 22 22"
                    fill="currentColor"
                  >
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-500">
                @{conversation.username}
              </span>
            </div>
          </div>
          <Info className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="mb-4">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
              <h3 className="text-xl font-bold text-white mb-1">
                {conversation.name}
              </h3>
              <p className="text-sm">@{conversation.username}</p>
            </div>
            <p className="text-sm max-w-xs">
              This is the beginning of your conversation with @
              {conversation.username}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-3xl px-4 py-2 ${
                  msg.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-black border-t border-gray-800 p-4">
        <div className="flex items-end gap-3 bg-gray-900 rounded-full px-4 py-2">
          <Image className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400 flex-shrink-0" />
          <Smile className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400 flex-shrink-0" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Start a new message"
            className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 py-2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`flex-shrink-0 ${
              message.trim()
                ? 'text-blue-500 hover:text-blue-400 cursor-pointer'
                : 'text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
