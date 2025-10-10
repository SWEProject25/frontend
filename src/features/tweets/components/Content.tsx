import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function Content({
  text,
  image,
  name,
  username,
  isVerified,
}: {
  text: string;
  image: string;
  name: string;
  username: string;
  isVerified: boolean;
}) {
  return (
    <div>
      {/* Name, verified, username */}
      <div className="flex items-center gap-2 mb-1">
        <Link href="/profile" className=" flex items-center gap-1">
          <span className="font-bold hover:underline">{name}</span>
          {isVerified && (
            <FaCheckCircle className="inline text-blue-500" size={16} />
          )}
          <span className="text-gray-400 text-sm">{username}</span>
        </Link>
      </div>
      <p className="text-gray-200">{text}</p>
      {/* Image under text, full width */}
      <div className="mt-3 rounded-xl overflow-hidden">
        <Image
          width={600}
          height={400}
          src={image}
          alt="Tweet image"
          className="w-full h-auto rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
