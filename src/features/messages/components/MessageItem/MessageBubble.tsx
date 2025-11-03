import SeenStatus from './SeenStatus';
import MessageEditForm from './MessageEditForm';

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
  isEditing: boolean;
  editText: string;
  onEditTextChange: (text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export default function MessageBubble({
  message,
  isCurrentUser,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
}: MessageBubbleProps) {
  const isEdited =
    message.updatedAt &&
    new Date(message.updatedAt).getTime() -
      new Date(message.createdAt).getTime() >
      1000;

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
      {isEditing ? (
        <MessageEditForm
          editText={editText}
          onTextChange={onEditTextChange}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <p className="text-sm wrap-break-word">{message.text}</p>
          <span className="text-xs opacity-70 mt-1 flex items-center gap-1">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {isEdited && <span className="ml-1">(edited)</span>}
            </span>
            <SeenStatus isSeen={message.isSeen} isCurrentUser={isCurrentUser} />
          </span>
        </>
      )}
    </div>
  );
}
