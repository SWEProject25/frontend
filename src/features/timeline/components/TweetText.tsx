'use client';
import useAddTweetStore, {
  useMention,
} from '@/features/timeline/store/useAddTweetStore';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '@/features/timeline/constants/tweetConstants';
import { useEmoji } from '@/features/media/store/useMedia';
import { useActions } from '../store/useAddTweetStore';

const startRedText = MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH;
function setCartAtEnd(div: HTMLDivElement) {
  div.focus();
  const range = document.createRange();
  range.selectNodeContents(div);
  range.collapse(false);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
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
  const mention = useMention();
  const { setMention } = useActions();
  const spanMention = useRef<null | HTMLSpanElement>(null);
  const [mentionIsOpen, setMentionIsOpen] = useState(false);
  const emoji = useEmoji();
  useEffect(function () {
    setSpanText1("What's happening?");
  }, []);
  const handleChangeText = useCallback(
    (text: string, lastData: string | null = null) => {
      if (
        (text.endsWith(' @', text.length - 1) &&
          text[text.length - 1] !== '@') ||
        (text.startsWith('@', 0) &&
          text.length === 2 &&
          text[text.length - 1] !== '@') ||
        mentionIsOpen
      ) {
        // if (lastData) setMention(lastData);
        // handle if mention in redlines
        if (spanRef1.current)
          if (!mentionIsOpen) {
            const span = document.createElement('span');
            span.textContent = lastData;
            span.className = 'text-primary-hover';
            span.setAttribute('data-token', 'true');
            spanMention.current = span;
            spanRef1.current.appendChild(span);
            // spanRef1.current.innerHTML += `<span class='text-primary-hover'>${mention}</span>`;
          } else {
            if (spanMention.current && spanMention.current.textContent)
              spanMention.current.textContent += lastData;
          }
        setMentionIsOpen(true);
        if (divRef.current) setCartAtEnd(divRef.current);
        console.log('yep', text);
      } else if (spanRef1.current) {
        setMentionIsOpen(false);
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
    },
    [setTweetText, setMentionIsOpen, mentionIsOpen, divRef]
  );

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
  useEffect(
    function () {
      if (emoji) {
        if (divRef.current) {
          divRef.current.innerText = divRef.current.innerText + emoji;
          handleChangeText(divRef.current?.innerText);
        }
      }
    },
    [emoji, divRef, handleChangeText]
  );

  function handleInput(e: React.ChangeEvent<HTMLDivElement>) {
    if (divRef.current && divRef.current.innerHTML === '<br>') {
      divRef.current.innerHTML = '';
    }
    const input = e.nativeEvent as InputEvent;
    console.log(input.data);
    console.log('handleINput ', e);
    if (divRef.current) {
      handleChangeText(divRef.current?.innerText, input.data);
    }
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Backspace') return;
    console.log('as');
    const selction = document.getSelection();
    if (!selction || !selction.anchorNode) return;
    const node =
      selction.anchorNode.nodeType === Node.TEXT_NODE
        ? selction.anchorNode.parentNode
        : selction.anchorNode;

    console.log(node, selction.anchorNode);
    if (
      node instanceof HTMLSpanElement &&
      node.getAttribute('data-token') === 'true'
    ) {
      console.log('asqq');
      e.preventDefault();
      node.remove();
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
        onKeyDown={handleKeyDown}
        spellCheck={true}
        aria-label="Tweet text input overlay"
        className="   absolute top-0 pl-2 left-0 py-3 inset-0 w-full h-full text-transparent caret-white  outline-none whitespace-pre-wrap break-words overflow-wrap-anywhere pointer-events-auto text-xl"
      ></div>
    </div>
  );
}
