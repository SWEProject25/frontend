import { ReactNode } from 'react';

export default function AddTweetFooter({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-12 flex flex-1 items-center justify-between pr-5 ">
      {children}
    </div>
  );
}
