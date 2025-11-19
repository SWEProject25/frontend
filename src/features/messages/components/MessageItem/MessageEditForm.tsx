interface MessageEditFormProps {
  editText: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MessageEditForm({
  editText,
  onTextChange,
  onSave,
  onCancel,
}: MessageEditFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={editText}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent border border-white/30 rounded px-2 py-1 text-sm resize-none focus:outline-none focus:border-white"
        rows={3}
        maxLength={1000}
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 text-xs bg-white text-blue-500 hover:bg-gray-100 rounded transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
