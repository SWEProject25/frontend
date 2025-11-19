import { Image as ImageIcon, Smile, Send } from 'lucide-react';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMessageChange(e.target.value);
    onTyping();
  };

  return (
    <div className="shrink-0 bg-black border-t border-gray-800 p-4">
      {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
      <div className="flex items-end gap-3 bg-gray-900 rounded-full px-4 py-2">
        <ImageIcon
          className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400 shrink-0"
          aria-label="Add image"
        />
        <Smile className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400 shrink-0" />
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          placeholder="Start a new message"
          className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 py-2"
        />
        <button
          onClick={onSend}
          disabled={!message.trim()}
          className={`shrink-0 ${
            message.trim()
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
