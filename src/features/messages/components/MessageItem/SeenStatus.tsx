interface SeenStatusProps {
  isSeen: boolean;
  isCurrentUser: boolean;
}

export default function SeenStatus({ isSeen, isCurrentUser }: SeenStatusProps) {
  if (!isCurrentUser) return null;

  return (
    <span className="flex items-center ml-2">
      {isSeen ? (
        // Double checkmark for seen - VERY visible bright blue
        <span className="flex items-center gap-0.5" title="Seen">
          <svg
            className="w-4 h-4 text-[#1D9BF0]"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M2 10L6 14L14 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 10L10 14L18 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        // Single checkmark for sent - dimmer gray
        <span className="flex items-center" title="Sent">
          <svg
            className="w-4 h-4 text-gray-600"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4 10L8 14L16 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
}
