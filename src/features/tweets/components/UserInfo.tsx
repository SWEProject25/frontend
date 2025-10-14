import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function UserInfo({
  name,
  username,
  isVerified,
}: {
  name: string;
  username: string;
  isVerified: boolean;
}) {
  return (
    <Link href="/profile" className="flex items-center gap-1">
      <span className="font-bold hover:underline">{name}</span>
      {isVerified && (
        <FaCheckCircle className="inline text-blue-500" size={16} />
      )}
      <span className="text-gray-400 text-sm">{username}</span>
    </Link>
  );
}
