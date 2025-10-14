import React from 'react';

export default function WhoToFollow() {
  const suggestions = [
    { name: 'Bassem Youssef', handle: '@Byoussef', verified: true },
    { name: 'mbc3', handle: '@mbc3', verified: true },
  ];
  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-5 text-white">Who to follow</h2>
      <div className="space-y-3">
        {suggestions.map((user, i) => (
          <div
            key={i}
            className="flex items-center justify-between hover:bg-[#1D1F23] p-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <p className="font-bold text-white text-sm flex items-center gap-1">
                  {user.name}
                  {user.verified && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4 text-blue-500"
                    >
                      <path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm3.707 7.707l-4.25 4.25a1 1 0 01-1.414 0l-2.25-2.25a1 1 0 111.414-1.414L9 9.586l3.543-3.543a1 1 0 111.414 1.414z" />
                    </svg>
                  )}
                </p>
                <p className="text-gray-400 text-sm">{user.handle}</p>
              </div>
            </div>
            <button className="bg-white text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>
      <button className="text-blue-400 hover:underline mt-3 text-sm">
        Show more
      </button>
    </div>
  );
}
