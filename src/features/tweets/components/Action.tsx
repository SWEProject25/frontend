function Action({
  icon,
  count,
  label,
  color,
}: {
  icon: React.ReactNode;
  count?: string;
  label: string;
  color: string;
}) {
  // Icon and glow color classes
  const colorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-400',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400',
  };
  const countColorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-400',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400',
  };
  // Lower brightness for glow
  const glowMap: Record<string, string> = {
    blue: 'group-hover:before:bg-blue-400/20',
    green: 'group-hover:before:bg-green-500/20',
    rose: 'group-hover:before:bg-rose-400/20',
  };
  // All hints gray, text white
  return (
    <div className="flex flex-col items-center group relative">
      <div
        className="relative flex items-center cursor-pointer transition-colors"
        onClick={(e) => {
          e.preventDefault();
          // e.stopPropagation();
          // alert(label);
        }}
      >
        {/* Glow circle only around icon, sharp edge, only on hover */}
        <span
          className={`
            relative flex items-center justify-center
            w-8 h-8
            rounded-full
            before:content-['']
            before:absolute
            before:inset-0
            before:rounded-full
            before:opacity-0
            group-hover:before:opacity-100
            before:z-[1]
            ${glowMap[color]}
            transition-all
          `}
        >
          <span className={`transition-colors ${colorMap[color]}`}>{icon}</span>
        </span>
        {count !== undefined && (
          <span className={`text-xs transition-colors ${countColorMap[color]}`}>
            {count}
          </span>
        )}
      </div>
      {/* Label on hover: gray bg, white text */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-10
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-opacity
          text-white text-xs px-2 py-1 rounded
          bg-gray-700
          shadow
          z-10
          whitespace-nowrap
        `}
      >
        {label}
      </div>
    </div>
  );
}

export default Action;
