export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%]">
        <div className="rounded-2xl px-4 py-3 bg-gray-800 text-white rounded-bl-none">
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
