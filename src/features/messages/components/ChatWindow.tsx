'use client';
import ChatHeader from './chatwindow/ChatHeader';
import ChatMessageList from './chatwindow/ChatMessageList';
import ChatInput from './chatwindow/ChatInput';
import { useChatWindow } from './chatwindow/useChatWindow';

interface ChatWindowProps {
  conversationId?: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const {
    message,
    setMessage,
    loading,
    error,
    messages,
    conversationDetails,
    isTyping,
    currentUserId,
    isAuthenticated,
    isBlocked,
    handleSendMessage,
    handleKeyPress,
    handleTyping,
    handleDeleteMessage,
    isMyMessage,
  } = useChatWindow(conversationId);

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation
      </div>
    );
  }

  if (!isAuthenticated || !currentUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-red-500 text-6xl mb-4">Not Authenticated</div>
        <h2 className="text-xl font-bold text-white mb-2">Not Authenticated</h2>
        <p className="text-gray-400 mb-4">
          You need to be logged in to view messages.
        </p>
        <p className="text-sm text-gray-500">
          User ID: {currentUserId || 'None'} | Auth Status:{' '}
          {isAuthenticated ? 'Yes' : 'No'}
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div id="chat-window" className="flex flex-col bg-black w-full h-full">
      <ChatHeader
        name={conversationDetails.name}
        username={conversationDetails.username}
        avatar={conversationDetails.avatar}
        isVerified={conversationDetails.isVerified}
        isTyping={isTyping}
      />

      <ChatMessageList
        messages={messages}
        conversationName={conversationDetails.name}
        conversationUsername={conversationDetails.username}
        conversationAvatar={conversationDetails.avatar}
        onDeleteMessage={handleDeleteMessage}
        isMyMessage={isMyMessage}
        isTyping={isTyping}
      />

      <ChatInput
        message={message}
        error={error}
        onMessageChange={setMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        onTyping={handleTyping}
        isBlocked={isBlocked}
      />
    </div>
  );
}
