'use client';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import { RefObject, useEffect, useRef, useState } from 'react';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '@/features/timeline/constants/tweetConstants';

const startRedText = MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH;

export default function TweetText({
  divRef,
}: {
  divRef: RefObject<null | HTMLDivElement>;
}) {
  const setTweetText = useAddTweetStore((state) => state.setTweetText);
  const isSuccess = useAddTweetStore((state) => state.isSuccess);
  const spanRef1 = useRef<null | HTMLSpanElement>(null);
  const [spanText1, setSpanText1] = useState("What's happening?");
  const [spanText2, setSpanText2] = useState('');

  useEffect(function () {
    setSpanText1("What's happening?");
  }, []);

  useEffect(
    function () {
      if (isSuccess) {
        setSpanText1("What's happening?");
        if (spanRef1.current)
          spanRef1.current.style.color = 'var(--color-text-inactive)';
        setSpanText2('');
        if (divRef.current) divRef.current.innerText = '';
        // setTweetText('');
      }
    },
    [isSuccess, divRef]
  );

  function handleInput(e: React.ChangeEvent<HTMLDivElement>) {
    if (divRef.current && divRef.current.innerHTML === '<br>') {
      divRef.current.innerHTML = '';
    }
    console.log('handleINput ', e);
    handleChangeText(e.target.innerText);
  }
  function handleChangeText(text: string) {
    if (spanRef1.current) {
      if (text.length === 0) {
        console.log('erase');
        setSpanText1("What's happening?");
        spanRef1.current.style.color = 'var(--color-text-inactive)';
        setSpanText2('');
        setTweetText('');
        return;
      }
      setTweetText(text);
      spanRef1.current.style.color = 'var(--color-text-active)';
      setSpanText1(text.slice(0, startRedText));
      if (text.length > startRedText) {
        console.log('inside length greater than 10');

        console.log(text, 'after slicing');
        setSpanText2(text.slice(startRedText, text.length));
      } else {
        setSpanText2('');
      }
    }
  }

  return (
    <div
      data-testid="tweet-text-container"
      className="relative flex flex-1 max-w-[25rem] md:max-w-[32rem]  py-3 h-fit min-w-0 pl-2"
    >
      <div className="relative flex-1 min-w-0 min-h-7 whitespace-pre-wrap break-words overflow-wrap-anywhere">
        <span
          data-testid="tweet-text-display"
          ref={spanRef1}
          className="  text-text-inactive text-xl transition-[height] duration-100 ease-in-out"
        >
          {spanText1}
        </span>
        <span
          data-testid="tweet-text-overflow"
          className=" bg-[rgb(138,13,32)] text-xl transition-[height] duration-100 ease-in-out"
        >
          {spanText2}
        </span>
      </div>

      <div
        contentEditable="plaintext-only"
        onInput={handleInput}
        data-testid="tweet-text-input"
        ref={divRef}
        spellCheck={true}
        aria-label="Tweet text input overlay"
        className="   absolute top-0 pl-2 left-0 py-3 inset-0 w-full h-full text-transparent caret-white  outline-none whitespace-pre-wrap break-words overflow-wrap-anywhere pointer-events-auto text-xl"
      ></div>
    </div>
  );
}
