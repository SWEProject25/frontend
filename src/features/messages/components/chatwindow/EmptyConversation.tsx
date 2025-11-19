import NextImage from 'next/image';

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
      <div className="mb-4">
        <NextImage
          src={avatar}
          alt={name}
          width={64}
          height={64}
          className="rounded-full mx-auto mb-3"
        />
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-sm">@{username}</p>
      </div>
      <p className="text-sm max-w-xs">
        This is the beginning of your conversation with @{username}
      </p>
    </div>
  );
}
