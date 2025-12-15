import Tooltip from '@mui/material/Tooltip';
interface IconOptions {
  path: string;
  viewBox?: number;
  size?: string;
  title?: string;
  disabled?: boolean;
  tooltip?: boolean;
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
  width?: string;
  height?: string;
  dataTestId?: string;
  center?: boolean;
}
export default function Icon({
  path,
  viewBox = 24,
  size = 'w-5 h-5',
  title = '',
  disabled = false,
  color = disabled ? 'text-primary/50' : 'text-primary',
  hoverColor = !disabled ? 'bg-icon-hover' : '',
  width = 'h-9',
  height = 'w-9',
  onClick,
  dataTestId = 'icon',
  center = false,
}: IconOptions) {
  const icon = (
    <div
      data-testid={dataTestId}
      onClick={onClick}
      className={`${center && 'self-center'} relative flex items-center justify-center ${width} ${height}  ${!disabled && 'hover:cursor-pointer'} rounded-full  hover:${hoverColor} transition-colors`}
    >
      <svg
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        aria-hidden="true"
        className={`fill-current ${size}  ${color}  `}
      >
        <g>
          <path d={path}></path>
        </g>
      </svg>
    </div>
  );

  return (
    <>
      {!disabled ? (
        <div className={`flex items-center justify-center ${width}  ${height}`}>
          <Tooltip
            // enterTouchDelay={1000}
            enterNextDelay={500}
            title={title}
            disableInteractive
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -12],
                    },
                  },
                ],
              },
            }}
          >
            {icon}
          </Tooltip>
        </div>
      ) : (
        icon
      )}
    </>
  );
}
