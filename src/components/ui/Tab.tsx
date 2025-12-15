interface TabOptions {
  text: string;
  id: number;
  selected: boolean;
  onClick: (id: number) => void;
  'data-testid'?: string;
}

export default function Tab({
  text,
  id,
  selected,
  onClick,
  'data-testid': testId,
}: TabOptions) {
  return (
    <div
      data-testid={testId || `${text.toLowerCase().replace(/\s+/g, '-')}-tab`}
      onClick={() => onClick(id)}
      className="flex flex-1 flex-col h-full items-center justify-center px-4 relative hover:cursor-pointer hover:bg-white/12 "
    >
      <div className="relative flex flex-col items-center h-full justify-center">
        <span
          className={`text-center text-l font-bold whitespace-nowrap ${selected ? 'text-text-active' : 'text-text-inactive'}`}
        >
          {text}
        </span>
        {selected && (
          <div className="absolute bottom-0 w-full h-1 rounded-lg bg-primary"></div>
        )}
      </div>
    </div>
  );
}
