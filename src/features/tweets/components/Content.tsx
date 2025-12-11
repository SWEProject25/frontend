import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuoteTweet from './QuoteTweet';
import Icon from '@/components/ui/home/Icon';

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
            onClick={(e) => e.stopPropagation()} // here put link to hashtag page
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
            <img
              src={media[0].url}
              alt="Tweet image"
              className={`${fullWidth ? 'w-full' : 'max-w-full'} h-auto object-cover rounded-2xl cursor-pointer`}
              style={{ maxHeight: '80vh', display: 'block' }}
              onClick={(e) => {
                e.stopPropagation();
                openModal(0, e);
              }}
            />
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
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            className="absolute top-4 left-4 text-white text-2xl hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center z-[10000]"
            onClick={closeModal}
          >
            ×
          </button>

          {/* Image counter */}
          {media.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-[10000]">
              {selectedImageIndex + 1} / {media.length}
            </div>
          )}

          {/* Navigation arrows */}
          {media.length > 1 && selectedImageIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-black/80 cursor-pointer text-white rounded-full"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <Icon
                disabled={true}
                color="text-white"
                path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              />
            </button>
          )}

          {media.length > 1 && selectedImageIndex < media.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-black/80 cursor-pointer text-white rounded-full"
              onClick={nextImage}
              aria-label="Next image"
            >
              <Icon
                disabled={true}
                color="text-white"
                path="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"
              />
            </button>
          )}

          {/* Image container */}
          <div
            className="max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {media[selectedImageIndex]?.type.toLowerCase() === 'image' ? (
              <img
                src={media[selectedImageIndex]?.url}
                alt={`Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[95vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                controls
                className="max-w-full max-h-[95vh] object-contain"
                src={media[selectedImageIndex]?.url}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// new hi
