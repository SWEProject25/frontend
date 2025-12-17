import { ReactNode } from 'react';

export default function AddTweetFooter({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="tweet-footer"
      className="w-full h-13 flex flex-1 items-center justify-between pb-2 border-t border-border  "
    >
      {children}
    </div>
  );
}
