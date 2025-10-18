'use client';
import Input from '@/features/timeline/Input';
import TimeOptions from '@/features/timeline/TimeOptions';
import { useState } from 'react';
import usePollStore from '@/services/usePollStore';

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
export default function Poll({ onClose }: { onClose: () => void }) {
  const choices = usePollStore((state) => state.choices);
  const time = usePollStore((state) => state.time);
  const setChoice = usePollStore((state) => state.setChoice);
  const setTime = usePollStore((state) => state.setTime);
  const shiftStartMinutes = usePollStore((state) => state.shiftStartMinutes);
  const [state, setState] = useState<number>(0);

  return (
    <div className="w-[513px] rounded-lg bg-background border border-border  pt-4">
      <div className="space-y-3">
        <div className="space-y-3">
          <div className="flex flex-1 justify-between items-start px-4">
            <Input label="Choice 1" />
          </div>

          <div className="flex items-center px-4">
            <div className="flex-1">
              <Input label="Choice 2" />
            </div>
            {state === 0 && (
              <button
                onClick={() => setState(1)}
                className="flex justify-center w-8 h-8 rounded-full hover:bg-icon-hover ml-3 text-primary text-2xl text-center hover:cursor-pointer"
              >
                +
              </button>
            )}
          </div>

          {state >= 1 && (
            <div className="flex items-center px-4">
              <div className="flex-1">
                <Input
                  isActive={true}
                  label="Choice 3 (optional)"
                  required={false}
                />
              </div>

              {state === 1 && (
                <button
                  onClick={() => setState(2)}
                  className="flex rounded-full w-9 h-9 hover:bg-icon-hover ml-3 text-primary text-2xl text-center hover:cursor-pointer"
                >
                  +
                </button>
              )}
            </div>
          )}
          {state >= 2 && (
            <div className="flex items-center px-4">
              <div className="flex-1">
                <Input
                  isActive={true}
                  label="Choice 4(optional)"
                  required={false}
                />
              </div>
            </div>
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
