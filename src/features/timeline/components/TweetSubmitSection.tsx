import Button from '@/components/ui/home/Button';
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
      className="flex  flex-row-reverse  items-center mt-2   "
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
          <div className="flex items-center hover:cursor-pointer pl-3 border-l-2 border-border h-10"></div>
          <TypingProgressCircle />
        </>
      )}
    </div>
  );
}
