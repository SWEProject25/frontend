import Button from '@/components/ui/Button';

interface WelcomeScreenProps {
  onNewMessageClick?: () => void;
}

export default function WelcomeScreen({
  onNewMessageClick,
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center  w-[600px] p-8 text-center">
      <h2 className="text-3xl font-bold text-white mb-3">Select a message</h2>
      <p className="text-gray-500 text-base max-w-sm mb-6">
        Choose from your existing conversations, start a new one, or just keep
        swimming.
      </p>
      <Button
        id="welcome-new-message-btn"
        variant="primary"
        size="lg"
        onClick={onNewMessageClick}
      >
        New message
      </Button>
    </div>
  );
}
