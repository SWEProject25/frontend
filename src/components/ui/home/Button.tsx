'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  height?: string;
  width?: string;
  size?: string;
}
export default function Button({
  label,
  onClick,
  disabled = false,
  height = 'h-10',
  width = 'w-20',
  size = 'text-lg',
}: ButtonProps) {
  return (
    <div className="flex items-center ">
      <button
        data-testid={`button-${label}`}
        disabled={disabled}
        onClick={onClick}
        className={`    bg-text-button rounded-r-full rounded-l-full p-1 ${disabled ? 'bg-text-inactive' : 'hover:bg-button-hover hover:cursor-pointer'} font-semibold text-muted  ${size} ${height} ${width}`}
      >
        {label}
      </button>
    </div>
  );
}
