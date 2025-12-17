import React from 'react';

export default function DeletedTweet({ id }: { id: number }) {
  return (
    <div
      data-testid={`tweet-${id}`}
      className={`block mx-auto p-3 border border-gray-300/10 rounded-xl w-full text-white relative bg-gray-300/10`}
      style={{
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'visible',
      }}
    >
      <div className="flex w-full gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className="flex items-center justify-between w-full"
            data-testid="tweet-header"
            style={{ maxWidth: '100%' }}
          >
            <div className="flex items-center gap-1">
              <span className="text-gray-400">This tweet is unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
