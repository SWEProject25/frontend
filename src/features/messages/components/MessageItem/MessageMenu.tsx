import { Trash2 } from 'lucide-react';

interface MessageMenuProps {
  show: boolean;
  onDelete: () => void;
}

export default function MessageMenu({ show, onDelete }: MessageMenuProps) {
  if (!show) return null;

  return (
    <div
      className="
        absolute right-full top-0 mr-2 z-10
        bg-gray-950 border border-gray-800 rounded-lg
        shadow-lg min-w-[150px]
        animate-in fade-in slide-in-from-right-2
      "
    >
      <button
        onClick={onDelete}
        className="
          w-full px-4 py-2 text-left text-base
          text-red-400 hover:bg-gray-800
          flex items-center gap-2
          rounded-lg transition-colors
        "
      >
        unsend
      </button>
    </div>
  );
}
