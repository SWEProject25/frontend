interface SeenStatusProps {
  isSeen: boolean;
  isCurrentUser: boolean;
}

export default function SeenStatus({ isSeen, isCurrentUser }: SeenStatusProps) {
  if (!isCurrentUser) return null;

  // Only show "Seen" text when message is seen, nothing when unseen
  if (!isSeen) return null;

  return (
    <span className="flex items-center ml-1">
      <span className="text-[10px] text-white" title="Seen">
        Seen
      </span>
    </span>
  );
}
