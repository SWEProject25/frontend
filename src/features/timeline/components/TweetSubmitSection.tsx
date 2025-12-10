import Button from '@/components/ui/home/Button';
import Icon from '@/components/ui/home/Icon';
import TypingProgressCircle from './TypingProgressCircle';

interface SubmitInterface {
  enableSection: boolean;
  enableAddTweet: boolean;
  handleAddTweet: () => void;
  label: string;
}

export default function TweetSubmitSection({
  enableSection,
  enableAddTweet,
  handleAddTweet,
  label,
}: SubmitInterface) {
  return (
    <div
      data-testid="tweet-submit-section"
      className="flex  flex-row-reverse  items-center mt-2  "
    >
      <div className="ml-3 flex flex-1">
        <Button
          data-testid="tweet-post-button"
          height="h-9"
          width="w-16"
          disabled={!enableAddTweet}
          size="text-base"
          label={label}
          onClick={handleAddTweet}
        />
      </div>

      {enableSection && (
        <>
          <div className="flex items-center hover:cursor-pointer pl-3 border-l-2 border-border h-10">
            <div className="rounded-full flex text-primary items-center justify-center border-border border-2 w-7 h-7  ">
              <Icon
                data-testid="tweet-add-thread"
                width="w-6"
                height="h-6"
                title="Add"
                size="w-4 h-4"
                path="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"
              />
            </div>
          </div>
          <TypingProgressCircle />
        </>
      )}
    </div>
  );
}
