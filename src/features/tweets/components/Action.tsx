import Label from './Label';

function Action({
  icon,
  count,
  label,
  color,
  stopPropagation = true,
  onClick,
}: {
  icon: React.ReactNode;
  count?: string;
  label?: string;
  color: string;
  stopPropagation?: boolean;
  onClick?: () => void;
}) {
  // Icon and glow color classes
  const colorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-400',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400',
    gray: 'group-hover:text-gray-400',
  };
  const countColorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-400',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400',
    gray: 'group-hover:text-gray-400',
  };
  // Lower brightness for glow
  const glowMap: Record<string, string> = {
    blue: 'group-hover:before:bg-blue-400/20',
    green: 'group-hover:before:bg-green-500/20',
    rose: 'group-hover:before:bg-rose-400/20',
    gray: 'group-hover:before:bg-gray-400/20',
  };
  // All hints gray, text white
  return (
    <div className="flex flex-col items-center group relative">
      <div
        className="relative flex items-center cursor-pointer transition-colors gap-x-1"
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
        }}
      >
        {/* Glow circle only around icon, sharp edge, only on hover */}
        <button
          onClick={onClick ? onClick : undefined}
          className={`
            relative flex items-center justify-center
            w-auto h-auto
            rounded-full
            before:content-['']
            before:absolute
            before:left-1/2 before:top-1/2
            before:-translate-x-1/2 before:-translate-y-1/2
            before:w-8 before:h-8
            before:rounded-full
            before:opacity-0
            group-hover:before:opacity-100
            before:z-[1]
            ${glowMap[color]}
            transition-all
          `}
        >
          <span className={`transition-colors ${colorMap[color]}`}>{icon}</span>
        </button>
        {count !== undefined && (
          <span className={`text-xs transition-colors ${countColorMap[color]}`}>
            {count}
          </span>
        )}
      </div>
      {/* Label on hover: smaller and directly under the icon */}
      {label && <Label label={label} />}
    </div>
  );
}

export default Action;
