export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
      <span className="flex gap-0.5">
        <span
          className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </span>
      <span>typing...</span>
    </div>
  );
}
