import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuoteTweet from './QuoteTweet';
import ImageModal from '@/components/generic/ImageModal';
import { useRouter } from 'next/navigation';

type MediaItem = {
  url: string;
  type: string | 'image' | 'video';
};

type mention = {
  userId: number;
  username: string;
};

type TweetContent = {
  text?: string;
  media?: MediaItem[];
  mentions?: mention[];
};
type quoteProps = {
  postId: number;
  userId: number;
  tweetContent: TweetContent;
  avatar: string | null;
  name: string;
  username: string;
  isVerified: boolean;
  date: string;
};

export default function Content({
  content,
  isQuote = false,
  data = undefined,
  fullWidth = false,
  isInModal = false,
}: {
  content: TweetContent;
  isQuote?: boolean;
  data?: quoteProps;
  fullWidth?: boolean;
  isInModal?: boolean;
}) {
  const media = content.media || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();
  const openModal = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex < media.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Function to render text with hashtags styled
  const renderTextWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();

              router.push(`/search?q=${encodeURIComponent(part)}`);
            }} // here put link to hashtag page
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Function to render media grid based on count
  const renderMediaGrid = () => {
    if (media.length === 0) return null;

    // Single image - takes natural size, doesn't upscale (unless fullWidth is true)
    if (media.length === 1) {
      return (
        <div className="w-full rounded-2xl overflow-hidden">
          {media[0].type.toLowerCase() === 'image' ? (
            <div
              className={`${fullWidth ? 'w-full' : 'max-w-full'} h-auto object-cover rounded-2xl cursor-pointer`}
              style={{
                maxHeight: '80vh',
                display: 'block',
                position: 'relative',
                minHeight: '200px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                openModal(0, e);
              }}
            >
              <Image
                src={media[0].url}
                alt="Tweet image"
                fill
                className="object-cover rounded-2xl"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 700px"
                priority
              />
            </div>
          ) : (
            <video
              controls
              className={`${fullWidth ? 'w-full' : 'max-w-full'} h-auto object-cover rounded-2xl`}
              style={{ maxHeight: '80vh', display: 'block' }}
              src={media[0].url}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      );
    }

    // Two images - split vertically (side by side), allow more height
    if (media.length === 2) {
      return (
        <div
          className="grid grid-cols-2 gap-1 w-full rounded-2xl overflow-hidden"
          style={{ maxHeight: '500px' }}
        >
          {media.map((item, idx) => (
            <div key={idx} className="relative h-full min-h-[250px]">
              {item.type.toLowerCase() === 'image' ? (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(idx, e);
                  }}
                >
                  <Image
                    fill
                    src={item.url}
                    alt={`Tweet image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={item.url}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    // Three images - first takes left half, other two split right half horizontally
    if (media.length === 3) {
      return (
        <div
          className="grid grid-cols-2 gap-1 w-full rounded-2xl overflow-hidden"
          style={{ maxHeight: '500px' }}
        >
          {/* First image - left half */}
          <div className="relative row-span-2 h-full min-h-[300px]">
            {media[0].type.toLowerCase() === 'image' ? (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(0, e);
                }}
              >
                <Image
                  fill
                  src={media[0].url}
                  alt="Tweet image 1"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <video
                controls
                className="w-full h-full object-cover"
                src={media[0].url}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          {/* Right half - two images stacked */}
          <div className="grid grid-rows-2 gap-1 h-full">
            {media.slice(1).map((item, idx) => (
              <div key={idx + 1} className="relative min-h-[150px]">
                {item.type.toLowerCase() === 'image' ? (
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(idx + 1, e);
                    }}
                  >
                    <Image
                      fill
                      src={item.url}
                      alt={`Tweet image ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={item.url}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Four or more images - 2x2 grid (quarters)
    return (
      <div
        className="grid grid-cols-2 grid-rows-2 gap-1 w-full rounded-2xl overflow-hidden"
        style={{ maxHeight: '500px' }}
      >
        {media.slice(0, 4).map((item, idx) => (
          <div key={idx} className="relative min-h-[200px]">
            {item.type.toLowerCase() === 'image' ? (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(idx, e);
                }}
              >
                <Image
                  fill
                  src={item.url}
                  alt={`Tweet image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <video
                controls
                className="w-full h-full object-cover"
                src={item.url}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="w-full"
      data-testid="tweet-content"
      style={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'visible',
        wordBreak: 'break-word',
      }}
    >
      {/* Render mentions inline with text */}
      <div className="text-gray-200 text-left">
        {content.mentions && content.mentions.length > 0 && (
          <span className="inline-flex flex-wrap gap-1 mr-1">
            {content.mentions.map((mention, index) => (
              <Link
                key={index}
                href={`/${mention.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:underline text-sm"
              >
                @{mention.username}
              </Link>
            ))}
          </span>
        )}
        {content.text && (
          <span data-testid="tweet-text" className="inline">
            {renderTextWithHashtags(content.text)}
          </span>
        )}
      </div>

      {media.length > 0 && <div className="mt-3">{renderMediaGrid()}</div>}

      {isQuote && (
        <div className="mt-3" style={{ overflow: 'visible' }}>
          {data && <QuoteTweet {...data} isInModal={isInModal} />}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        media={media}
        currentIndex={selectedImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
        showNavigation={true}
        showCounter={true}
      />
    </div>
  );
}

// new hi
