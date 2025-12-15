'use client';
import { GrokIcon } from '@/components/ui/icons';
import AnimatedSummary from './AnimatedSummary';
import { CollapseIcon, AutoIcon } from '@/components/ui/icons/UIIcons';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import SubTweet from '@/features/tweets/components/SubTweet';
import { useRouter } from 'next/navigation';
export default function GrokSummary() {
  const STORE = useTweetStore();
  const opened = STORE.isSummaryOpened;
  const setOpened = (val: boolean) => STORE.setSummaryOpened(val);
  const content = STORE.tweetSummary;
  const summaryTweet = STORE.summaryTweet;
  const contentTweet = {
    text: summaryTweet?.text,
    media: [],
  };

  return (
    <div>
      <SummaryButton setOpened={setOpened} />
      {opened && (
        <div
          className="fixed bottom-36 right-8 z-50 w-[350px] max-w-[90vw] bg-black rounded-2xl shadow-2xl border border-gray-700 flex flex-col"
          style={{
            boxShadow:
              '0 8px 32px 0 rgba(0,0,0,0.45), 0 0 24px 2px rgba(220,220,220,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Header */}
          <SummaryHeader setOpened={setOpened} />
          {/* Only render SubTweet if summaryTweet exists */}
          {summaryTweet && (
            <SummarySubTweet
              summaryTweet={summaryTweet}
              contentTweet={contentTweet}
            />
          )}
          {/* Content */}
          <div className="px-5 py-4 max-h-[300px] overflow-y-auto relative">
            <AnimatedSummary content={content} />
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryHeader({ setOpened }: { setOpened: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <GrokIcon className="w-7 h-7 text-white" />
        <span className="font-bold text-base text-white">Grok Summary</span>
      </div>
      <button
        className="p-2 rounded-full hover:bg-gray-900 transition-colors"
        onClick={() => setOpened(false)}
        aria-label="Close summary"
      >
        <CollapseIcon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}

function SummarySubTweet({
  summaryTweet,
  contentTweet,
}: {
  summaryTweet: any;
  contentTweet: any;
}) {
  const router = useRouter();
  return (
    <div>
      <div
        onClick={() => {
          router.push(`/home/${summaryTweet.postId}`);
        }}
        className="hover:bg-[#0a0a0a]"
      >
        <div className="px-5 pt-4 pb-2">
          <SubTweet tweet={summaryTweet} content={contentTweet} />
        </div>
      </div>
      <hr className="border-t border-gray-800 mx-5 my-2" />
    </div>
  );
}

function SummaryButton({ setOpened }: { setOpened: (val: boolean) => void }) {
  return (
    <button
      className="hidden sm:block fixed bottom-20 right-8 z-50 w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-gray-600 hover:bg-[#101a2b]"
      onClick={() => setOpened(true)}
    >
      <div className="flex items-center justify-center">
        <GrokIcon className="w-8 h-8" />
      </div>
    </button>
  );
}
