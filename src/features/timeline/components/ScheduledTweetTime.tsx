'use client';
import Icon from '@/components/ui/home/Icon';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';

export default function ScheduledTweetTime() {
  const scheduledTime = useAddTweetStore((state) => state.scheduledTime);
  const currDate = new Date();
  currDate.setDate(currDate.getDate() + 5);
  const date = currDate.setHours(currDate.getHours() + 1);
  console.log(date);
  const timearr = currDate.toLocaleTimeString().split(' ');

  const day = scheduledTime || currDate.toDateString();
  const time = scheduledTime || timearr[0].slice(0, 5) + ' ' + timearr[1];
  return (
    <div className="text-sm h-5 mt-1 text-text-inactive  flex items-center ">
      <Icon
        width="w-6"
        height="h-6"
        disabled={true}
        color="text-text-inactive"
        path="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"
      ></Icon>
      <span className="pl-2">
        Will send on {day} at {time}
      </span>
    </div>
  );
}
