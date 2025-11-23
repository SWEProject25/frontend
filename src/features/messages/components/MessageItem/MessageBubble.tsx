import SeenStatus from './SeenStatus';

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
};

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({
  message,
  isCurrentUser,
}: MessageBubbleProps) {
  return (
    <div
      className={`
        rounded-2xl px-4 py-2
        ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-800 text-white rounded-bl-none'
        }
      `}
    >
      <p className="text-sm wrap-break-word">{message.text}</p>
      <span className="text-xs opacity-70 mt-1 flex items-center gap-1">
        <span>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <SeenStatus isSeen={message.isSeen} isCurrentUser={isCurrentUser} />
      </span>
    </div>
  );
}
