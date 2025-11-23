'use client';
import Icon from '@/components/ui/home/Icon';
import usePollStore from '../../store/usePollStore';
import useAddTweetStore from '../../store/useAddTweetStore';
import useScheduleStore from '../../store/useScheduleStore';
import { useRouter } from 'next/navigation';

export default function Schedule() {
  const open = useScheduleStore((state) => state.open);
  const close = useScheduleStore((state) => state.close);
  const isScheduleOpen = useScheduleStore((state) => state.isOpen);
  const selectedReplyOption = useAddTweetStore(
    (state) => state.selectedReplyOption
  );
  const isPollOpen = usePollStore((state) => state.isOpen);
  const disable = isPollOpen || selectedReplyOption !== 1;
  const router = useRouter();
  const handleOpenSchedule = () => {
    if (!disable) {
      if (isScheduleOpen) {
        close();
        router.replace('home');
      } else {
        open();
        router.push('/compose/post/schedule');
      }
    }
  };
  return (
    <Icon
      data-testid="tweet-option-schedule"
      onClick={handleOpenSchedule}
      title="Schedule"
      disabled={disable}
      path="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"
    />
  );
}
