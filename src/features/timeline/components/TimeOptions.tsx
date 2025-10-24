'use client';
interface TimeInterface {
  id: number;
  type: string;
  shiftStart?: number;
  option: number;
  setOption: (id: number, timeOption: number) => void;
}
export default function TimeOptions({
  id,
  type,
  shiftStart = 0,
  option,
  setOption,
}: TimeInterface) {
  const end = type === 'Days' ? 7 : type === 'Hours' ? 23 : 59;
  const start = shiftStart !== 0 && type === 'Minutes' ? shiftStart : 0;
  const arr = Array.from({ length: end - start + 1 }, (_, i) => i + start);

  return (
    <div className="w-full max-w-[150px]">
      <div className="relative">
        <select
          id={type}
          value={option}
          onChange={(e) => setOption(id, Number(e.target.value))}
          className="appearance-none peer  w-full h-15 bg-transparent px-3 pt-2 text-base text-amber-50 outline-none transition-colors duration-150 border-1 border-solid border-text-inactive rounded-md focus:border-primary focus:border-2  focus:px-[11px]"
          aria-label={type}
        >
          {arr.map((e) => (
            <option
              className="bg-background hover:bg-primary-hover/10"
              value={e}
              key={e}
            >
              {e}
            </option>
          ))}
        </select>

        <label
          htmlFor={type}
          className={`
            absolute left-2 pointer-events-none transition-all duration-150 ease-in-out text-text-inactive px-1  pt-1
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-lg scale-95 
           text-sm translate-y-0  peer-focus:text-primary 
          `}
        >
          {type}
        </label>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500  peer-focus:text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5  peer-focus:text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
