import { useState } from 'react';
import { Smile, Send, Ban } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  message: string;
  isBlocked?: boolean;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onTyping: () => void;
}

export default function ChatInput({
  message,
  isBlocked = false,
  onMessageChange,
  onSend,
  onKeyPress,
  onTyping,
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isBlocked) return;
    onMessageChange(e.target.value);
    onTyping();
  };

  const handleEmojiSelect = (emoji: string) => {
    if (isBlocked) return;
    onMessageChange(message + emoji);
    onTyping();
  };

  const toggleEmojiPicker = () => {
    if (isBlocked) return;
    setShowEmojiPicker(!showEmojiPicker);
  };

  const MAX_CHARS = 1000;
  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isSendDisabled = !message.trim() || isOverLimit || isBlocked;

  // Show blocked message instead of input
  if (isBlocked) {
    return (
      <div
        id="chat-input-wrapper"
        className="shrink-0 bg-black border-t border-gray-800 p-4"
      >
        <div className="flex flex-col items-center justify-center gap-2 bg-gray-900 rounded-lg px-4 py-3 text-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Ban className="w-5 h-5" />
            <span className="text-sm font-semibold">Messaging is blocked</span>
          </div>
          <span className="text-xs text-gray-500">
            You and this user cannot send messages to each other.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="chat-input-wrapper"
      className="shrink-0 bg-black border-t border-gray-800 p-4"
    >
      <div className="flex items-center gap-3 bg-gray-900 rounded-full px-4 py-2 relative">
        <button
          id="emoji-button"
          onClick={toggleEmojiPicker}
          className="shrink-0"
          type="button"
        >
          <Smile className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400" />
        </button>

        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        <input
          id="chat-input"
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          placeholder="Start a new message"
          className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 py-2"
        />
        {charCount > 0 && (
          <span
            className={`shrink-0 text-xs ${
              isOverLimit ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        )}
        <button
          id="send-button"
          onClick={onSend}
          disabled={isSendDisabled || isOverLimit}
          className={`shrink-0 ${
            !isSendDisabled
              ? 'text-blue-500 hover:text-blue-400 cursor-pointer'
              : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
