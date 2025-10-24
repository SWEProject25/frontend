import Icon from '../../../components/ui/home/Icon';

export default function TweetOptionsBar() {
  return (
    <div className="flex flex-1 items-center mr-auto h-10">
      <Icon
        title="Media"
        path="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
      >
        <label className="flex w-9 h-9 absolute bottom-1/2 translate-y-1/2  border-none p-0 m-0 bg-transparent text-[0px] outline-none focus:outline-none hover:cursor-pointer">
          <input
            // disabled={false}
            type="file"
            id="image"
            accept="image/*"
            aria-label="Media"
            className="hidden  "
            data-testid="tweet-options-image-input"
          />
        </label>
      </Icon>
    </div>
  );
}
