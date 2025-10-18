'use client';

import Button from '@/componenets/Button';
import Icon from '@/componenets/Icon';
import Modal, { useModal } from '@/componenets/Modal';
import { useEffect } from 'react';
import TimeOptions from './TimeOptions';
import ScheduledTweetTime from './ScheduledTweetTime';

export default function Schedule() {
  const { open, isOpen } = useModal();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <Modal>
      <Modal.Button>
        <Icon
          onClick={open}
          title="Schedule"
          path="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"
        />
      </Modal.Button>
      <Modal.Window>
        <div className="fixed left-1/2 -translate-x-1/2 inset-0 flex flex-col bg-background rounded-2xl shadow-xl h-[427.5px] w-[600px] m-10 py-1  ">
          <div className="flex items-center px-3 h-12 ">
            <div className="flex w-14 h-12 justify-start items-center">
              <Icon
                width="w-5"
                height="h-5"
                hoverColor="text-button-x-hover"
                color="text-button-x"
                path="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"
              ></Icon>
            </div>

            <div className="flex-1">
              <div className="text-xl font-bold ">Schedule</div>
            </div>
            <div>
              <Button
                size="text-sm"
                height="h-8"
                width="w-20"
                label="Confirm"
                onClick={() => {}}
              />
            </div>
          </div>
          <div className=" flex flex-col px-3 gap-y-3">
            <ScheduledTweetTime />

            <div className="space-y-2  text-text-inactive ">
              <div className="text-md  ">Date</div>
              <div className="flex items-center gap-3 ">
                <div className="flex-1 ">
                  <div className="border border-border rounded-md h-12 px-3 flex items-center justify-between">
                    October
                  </div>
                </div>
                <div className="w-28">
                  <div className="border border-border rounded-md h-12 px-3 flex items-center justify-between">
                    21
                  </div>
                </div>
                <div className="w-28">
                  <div className="border border-border rounded-md h-12 px-3 flex items-center justify-between">
                    2025
                  </div>
                </div>
                <div className="w-14 flex items-center justify-center   ">
                  <Icon
                    size="w-6 h-6"
                    width="w-14"
                    height="h-14"
                    hoverColor="text-button-x-hover"
                    color="text-button-x"
                    path="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"
                  ></Icon>
                </div>
              </div>
            </div>
            <div className=" space-y-2  text-text-inactive ">
              <div className="text-md ">Time</div>
              <div className="flex items-center gap-3 ">
                <div className="w-28">
                  <TimeOptions
                    type="Hours"
                    id={1}
                    option={0}
                    setOption={() => {}}
                  />
                </div>
                <div className="w-28">
                  <TimeOptions
                    type="Minutes"
                    id={2}
                    option={0}
                    setOption={() => {}}
                  />
                </div>
                <div className="w-28">
                  <TimeOptions
                    type="Minutes"
                    id={3}
                    option={0}
                    setOption={() => {}}
                  />
                </div>
              </div>
            </div>
            <div className="pl-2 pt-4 pb-6 gap-y-0 ">
              <div className="text-md text-text-inactive  ">Time zone</div>
              <div className="text-text-active text-xl ">
                {/* Eastern European Summer Time */}
                {new Date().toString().split('(')[1].split(')')[0]}
              </div>
            </div>
          </div>
          <div className=" border-t border-border ">
            <div className=" w-full max-h-9 flex flex-1 items-stretch  px-4    border-border ">
              <button
                onClick={() => {}} // open model
                className=" flex items-center mt-2 px-3 py-2 cursor-pointer hover:bg-icon-hover hover:rounded-full text-primary text-sm font-bold pr-3 "
              >
                <span className="text-center font-bold ">Scheduled posts</span>
              </button>
            </div>
          </div>
        </div>
      </Modal.Window>
    </Modal>
  );
}
