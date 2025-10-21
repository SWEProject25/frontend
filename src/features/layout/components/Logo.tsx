import React from 'react';

export default function Logo() {
  return (
    <div className="p-3 hover:bg-gray-900 rounded-full cursor-pointer w-fit transition-colors">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
      >
        <path d="M18.244 2H21.6L14.646 10.09L22 22H15.532L10.684 14.763L5.133 22H1.776L9.162 13.31L2.2 2H8.819L13.232 8.561L18.244 2ZM17.12 19.86H18.904L7.149 4.03H5.243L17.12 19.86Z" />
      </svg>
    </div>
  );
}
