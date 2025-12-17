import Avatar from '@/components/generic/Avatar';

interface EmptyConversationProps {
  name: string;
  username: string;
  avatar: string;
}

export default function EmptyConversation({
  name,
  username,
  avatar,
}: EmptyConversationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <div className="mb-4 flex flex-col items-center">
        <div className="mb-3">
          <Avatar
            avatarImage={avatar || null}
            name={name}
            size="md"
            position="relative"
            className="border-2"
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-sm">@{username}</p>
      </div>
      <p className="text-sm max-w-xs">
        This is the beginning of your conversation with @{username}
      </p>
    </div>
  );
}
