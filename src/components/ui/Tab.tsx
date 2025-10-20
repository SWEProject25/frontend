interface TabOptions {
  text: string;
  id: number;
  selected: boolean;
  onClick: (id: number) => void;
}

export default function Tab({ text, id, selected, onClick }: TabOptions) {
  return (
    <div
      onClick={() => onClick(id)}
      className="flex flex-1 flex-col h-full items-center justify-center px-4 relative hover:cursor-pointer hover:bg-white/12"
    >
      <div
        className={`relative flex flex-1 h-full items-center   ${selected ? ' text-text-active' : 'text-text-inactive'}`}
      >
        <div className={`flex flex-1 w-fit  `}>
          <span className="  text-center text-l font-bold ">{text}</span>
        </div>
        {selected && (
          <div className="flex flex-1 w-full absolute min-w-14 h-1 bottom-0 rounded-lg bg-primary"></div>
        )}
      </div>
    </div>
  );
}
