import Image from 'next/image';
import Link from 'next/link';

export default function Avatar({ image }: { image?: string }) {
  return (
    <Link href="/profile">
      <Image
        width={48}
        height={48}
        src={image || '/default-avatar.png'}
        alt="User avatar"
        className="w-12 h-12 rounded-full"
      />
    </Link>
  );
}
