'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import RepostersList from '@/features/tweets/components/RepostersList';
import { ArrowLeftIcon } from '@/components/ui/icons/UIIcons';

export default function RepostersPage() {
  const params = useParams();
  const router = useRouter();
  const tweetId = Number(params?.['full-tweet'] ?? 0);

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Reposted by</h1>
          </div>
        </div>
      </div>

      {/* Reposters List */}
      <RepostersList tweetId={tweetId} />
    </div>
  );
}
