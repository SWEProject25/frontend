import { useState } from 'react';
import { Image as ImageIcon, Smile, Send } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  message: string;
  error: string | null;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onTyping: () => void;
}

export default function ChatInput({
  message,
  error,
  onMessageChange,
  onSend,
  onKeyPress,
  onTyping,
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMessageChange(e.target.value);
    onTyping();
  };

  const handleEmojiSelect = (emoji: string) => {
    onMessageChange(message + emoji);
    onTyping();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const MAX_CHARS = 1000;
  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isSendDisabled = !message.trim() || isOverLimit;

  return (
    <div className="shrink-0 bg-black border-t border-gray-800 p-4">
      {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
      {isOverLimit && (
        <div className="mb-2 text-red-500 text-sm">
          Message exceeds {MAX_CHARS} character limit
        </div>
      )}
      <div className="flex items-center gap-3 bg-gray-900 rounded-full px-4 py-2 relative">
        <button onClick={toggleEmojiPicker} className="shrink-0" type="button">
          <Smile className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400" />
        </button>

        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        <input
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
          onClick={onSend}
          disabled={isSendDisabled}
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
