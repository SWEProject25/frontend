import { useRouter } from 'next/navigation';
import Avatar from '@/components/generic/Avatar';

interface ChatHeaderProps {
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isTyping: boolean;
}

export default function ChatHeader({
  name,
  username,
  avatar,
  isVerified,
}: ChatHeaderProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/${username}`);
  };

  return (
    <div className="shrink-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleProfileClick}
            className="shrink-0 hover:opacity-80 transition-opacity"
            aria-label={`View ${name}'s profile`}
          >
            <Avatar
              avatarImage={avatar || null}
              name={name}
              size="sm"
              position="relative"
              className="shrink-0"
            />
          </button>
          <button
            onClick={handleProfileClick}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-white">{name}</h3>
              {isVerified && (
                <svg
                  className="w-4 h-4 text-blue-500"
                  viewBox="0 0 22 22"
                  fill="currentColor"
                >
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-500">@{username}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
