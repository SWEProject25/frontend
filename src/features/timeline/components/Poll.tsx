'use client';
import Input from '@/features/timeline/components/Input';
import TimeOptions from '@/features/timeline/components/TimeOptions';
import usePollStore from '@/features/timeline/store/usePollStore';

const timeInputs = [
  { id: 1, type: 'Days' },
  { id: 2, type: 'Hours' },
  { id: 3, type: 'Minutes' },
];
const inputs = [
  { id: 1, required: true },
  { id: 2, required: true },
  { id: 3, required: false },
  { id: 4, required: false },
];
export default function Poll() {
  const choices = usePollStore((state) => state.choices);
  const setChoice = usePollStore((state) => state.setChoice);
  const time = usePollStore((state) => state.time);
  const setTime = usePollStore((state) => state.setTime);
  const shiftStartMinutes = usePollStore((state) => state.shiftStartMinutes);
  const isOpen = usePollStore((state) => state.isOpen);
  const onClose = usePollStore((state) => state.close);
  const buttonInputIndex = usePollStore((state) => state.buttonInputIndex);
  const setButtonInputIndex = usePollStore(
    (state) => state.setButtonInputIndex
  );
  if (!isOpen) return null;
  return (
    <div className="w-[513px] rounded-lg bg-background border border-border mb-1 pt-4">
      <div className="space-y-3">
        <div className="space-y-3">
          {inputs.map(
            (inp) =>
              buttonInputIndex >= inp.id && (
                <div key={inp.id} className="flex items-center px-4">
                  <div className="flex-1">
                    <Input
                      id={inp.id}
                      value={choices[inp.id - 1]}
                      setValue={setChoice}
                      required={inp.required}
                      isActive={buttonInputIndex > 2 || inp.id === 1}
                      label={`Choice ${inp.id} ${!inp.required ? '(optional)' : ''}`}
                    />
                  </div>
                  {buttonInputIndex === inp.id && buttonInputIndex != 4 && (
                    <button
                      onClick={() => setButtonInputIndex(inp.id + 1)}
                      className="flex justify-center w-8 h-8 rounded-full hover:bg-icon-hover ml-3 text-primary text-2xl text-center hover:cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>
              )
          )}
        </div>

        <div className="pt-3 px-4 border-t border-border">
          <div className="text-lg text-amber-50 mb-3">Poll length</div>
          <div className="flex gap-4 ">
            {timeInputs.map((inp) => (
              <div key={inp.id} className=" flex flex-1">
                <TimeOptions
                  id={inp.id}
                  type={inp.type}
                  option={time[inp.id - 1]}
                  setOption={setTime}
                  shiftStart={shiftStartMinutes}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
          }}
          className="flex w-full justify-center p-4 border-t text-error font-medium border-border  hover:bg-red-800/15 hover:cursor-pointer text-center rounded"
        >
          Remove poll
        </button>
      </div>
    </div>
  );
}
