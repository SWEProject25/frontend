import Label from './Label';
import {
  ACTION_COLOR_MAP,
  ACTION_GLOW_MAP,
  ACTION_ACTIVE_MAP,
} from '../constants';
{
  /*before:z-[1]*/
}
function Action({
  icon,
  count,
  label,
  color,
  stopPropagation = true,
  onClick,
  onCountClick,
  isColored,
}: {
  icon: React.ReactNode;
  count?: number;
  label?: string;
  color: string;
  stopPropagation?: boolean;
  onClick?: () => void;
  onCountClick?: () => void;
  isColored?: boolean;
}) {
  // All hints gray, text white
  return (
    <div
      className="flex flex-col items-center group relative"
      data-testid={
        label
          ? `tweet-action-${label.toLowerCase().replace(/\s+/g, '-')}`
          : 'tweet-action'
      }
    >
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
            before:z-1               
            ${ACTION_GLOW_MAP[color]}
            transition-all
          `}
        >
          <span
            className={`transition-colors ${ACTION_COLOR_MAP[color]} ${isColored !== undefined ? (isColored === true ? ACTION_ACTIVE_MAP[color] : '') : ''}`}
          >
            {icon}
          </span>
        </button>
        {count !== undefined && (
          <span
            onClick={(e) => {
              if (onCountClick) {
                e.stopPropagation();
                onCountClick();
              }
            }}
            data-testid={`${label ? label.toLowerCase().replace(/\s+/g, '-') + '-' : ''}count`}
            className={`text-xs transition-colors ${onCountClick ? 'cursor-pointer hover:underline' : ''} ${ACTION_COLOR_MAP[color]} ${isColored !== undefined ? (isColored === true ? ACTION_ACTIVE_MAP[color] : '') : ''}`}
          >
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
