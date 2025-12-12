'use client';
import Icon from '@/components/ui/home/Icon';
import XMenu from '@/components/ui/home/XMenu';
import { EMOJI_MENU } from '@/features/timeline/constants/menuName';
import { useTweetText } from '@/features/timeline/store/useAddTweetStore';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { useMediaActions } from '../store/useMedia';
const PANEL_HEIGHT = 400;

export default function Emoji() {
  const tweetText = useTweetText();
  const { setEmoji } = useMediaActions();

  function hanldePickEmoji(emojiData: EmojiClickData) {
    console.log(emojiData.emoji);
    setEmoji(emojiData.emoji);
  }
  return (
    <XMenu>
      <XMenu.Button name={EMOJI_MENU} panelHeight={PANEL_HEIGHT}>
        <Icon
          data-testid="tweet-option-emoji"
          title="Emoji"
          path="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"
        />
      </XMenu.Button>
      <XMenu.List
        height="h-[400px]"
        width="w-[320px]"
        name={EMOJI_MENU}
        preventScroll={true}
      >
        <EmojiPicker
          onEmojiClick={hanldePickEmoji}
          autoFocusSearch={true}
          emojiStyle={EmojiStyle.TWITTER}
          theme={Theme.DARK}
          searchPlaceholder="Search emojis"
          width={320}
          height={400}
        />
      </XMenu.List>
    </XMenu>
  );
}
