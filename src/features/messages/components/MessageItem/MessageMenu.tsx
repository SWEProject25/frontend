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
        bg-gray-900 border border-gray-700 rounded-lg
        shadow-lg min-w-[150px]
        animate-in fade-in slide-in-from-right-2
      "
    >
      <button
        onClick={onDelete}
        className="
          w-full px-4 py-2 text-left text-sm
          text-red-400 hover:bg-gray-800
          flex items-center gap-2
          rounded-lg transition-colors
        "
      >
        <Trash2 className="w-4 h-4" />
        Delete message
      </button>
    </div>
  );
}
