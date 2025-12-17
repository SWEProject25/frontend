'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className=" min-h-96 flex flex-1 flex-col justify-center items-center text-center gap-6 px-4 h-full">
      <p className="text-gray-500   text-xl">
        Hmm...this page doesn&apos;t exist. Try searching for something else.
      </p>
      <button
        onClick={() => router.push('/explore')}
        className="bg-primary hover:bg-primary-hover cursor-pointer text-white font-bold py-3 px-8 rounded-full transition-colors text-[15px]"
      >
        Search
      </button>
    </div>
  );
}
