'use client';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import {
  useMention,
  useActions,
  useIsOpen,
  useMentionIsDone,
} from '@/features/timeline/store/useMentionStore';
import { useActions as useAddTweetActions } from '@/features/timeline/store/useAddTweetStore';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '@/features/timeline/constants/tweetConstants';
import { useEmoji } from '@/features/media/store/useMedia';
import { useCheckValidUser } from '../hooks/timelineQueries';

const startRedText = MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH;
function getCurrCursorPos(div: HTMLDivElement) {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return 0;
  console.log(selection);

  const range = document.createRange();
  range.setStart(div, 0);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().length;
}

function setCartAtEnd(div: HTMLDivElement) {
  div.focus();
  const range = document.createRange();
  range.selectNodeContents(div);
  range.collapse(false);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
export type mentionType = {
  indx: number;
  username: string;
  checked: boolean;
  id: number;
};

export type notMentionType = mentionType & {
  username: string;
  span: HTMLSpanElement;
};
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
  const mentionIsDone = useMentionIsDone();
  const { setMention, setIsOpen, setIsDone, setKeyDown } = useActions();
  const { setMentions } = useAddTweetActions();
  const spanMention = useRef<null | HTMLSpanElement>(null);
  const completedMentions = useRef<mentionType[]>([]);

  const notMentions = useRef<notMentionType[]>([]);
  const [checkValidUsers, setCheckValidUsers] = useState(-1);
  const { data } = useCheckValidUser(
    notMentions.current[checkValidUsers]?.username.slice(1) ?? ''
  );
  const isOpen = useIsOpen();
  console.log(notMentions.current);
  console.log(completedMentions.current);
  useEffect(
    function () {
      if (data?.data) {
        console.log(notMentions.current);

        console.log('dattttttttta0', data);
        const mention = notMentions.current[checkValidUsers];
        const span = mention.span;
        span.className = 'text-primary-hover';
        span.setAttribute('data-mention', 'completed');
        completedMentions.current.push({
          indx: mention.indx,
          username: mention.username,
          checked: true,
          id: data.data.User.id,
        });
        notMentions.current = notMentions.current.filter(
          (men, indx) => indx !== checkValidUsers
        );
        span.textContent = mention.username;

        console.log(notMentions.current);
        console.log(completedMentions.current);
      }
    },
    [checkValidUsers, data]
  );

  const emoji = useEmoji();
  const handleChangeText = useCallback(
    (text: string, lastData: string = '') => {
      const lastMatch = text.match(
        /(?<=^|\s)@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+$/
      ) ?? [''];
      const index = lastMatch.index;
      let isActiveMention = false;
      let lastMention = '';

      if (spanRef1.current) {
        if (text.length === 0) {
          setSpanText1("What's happening?");
          spanRef1.current.style.color = 'var(--color-text-inactive)';
          spanRef1.current.innerHTML = "What's happening?";
          setMention('');
          setIsDone('');
          completedMentions.current = [];
          setMentions(completedMentions.current);

          setIsOpen(false);
          setKeyDown('reset');
          spanMention.current = null;
          setSpanText2('');
          setTweetText('');
          return;
        }
        setTweetText(text);

        spanRef1.current.style.color = 'var(--color-text-active)';
        spanRef1.current.innerHTML = '';
        const displayedText = text.slice(0, startRedText);
        let lastIndex = 0;
        let tweetText = '';

        const matchRegex = /(?<=^|\s)@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+/g;
        let match;
        let cursor = 0;
        if (divRef.current) cursor = getCurrCursorPos(divRef.current);
        console.log(cursor);

        console.log(
          completedMentions,
          completedMentions.current.filter((ment) => ment.checked)
        );
        completedMentions.current = completedMentions.current.map(
          (mention) => ({
            ...mention,
            checked: false,
          })
        );
        console.log(
          completedMentions,
          completedMentions.current.filter((ment) => ment.checked)
        );
        while ((match = matchRegex.exec(displayedText)) !== null) {
          const mentionIndex = match.index;
          const mentionText = match[0];
          const mentionEndIndx = mentionIndex + mentionText.length;
          if (mentionIndex > lastIndex) {
            const node = document.createTextNode(
              displayedText.slice(lastIndex, mentionIndex)
            );
            spanRef1.current.appendChild(node);
            tweetText += displayedText.slice(lastIndex, mentionIndex);
          }
          let currIndx = 0;
          const isCompleted = completedMentions.current.some((ment, index) => {
            if (
              ment.username === mentionText &&
              Math.abs(ment.indx - mentionIndex) < 10 &&
              ment.checked === false
            ) {
              currIndx = index;
              return true;
            }
            return false;
          });
          if (isCompleted)
            completedMentions.current[currIndx] = {
              ...completedMentions.current[currIndx],
              checked: true,
              indx: mentionIndex,
            };

          const isActive = cursor >= mentionIndex && cursor <= mentionEndIndx;
          console.log(
            isActive,
            isCompleted,
            mentionIndex,
            mentionEndIndx,
            cursor
          );
          tweetText += mentionText;

          const span = document.createElement('span');
          span.textContent = mentionText;
          span.setAttribute(
            'data-mention',
            `${isCompleted ? 'completed' : isActive ? 'active' : 'notCompleted'}`
          );
          span.setAttribute('data-indx', `${mentionIndex}`);
          if (isActive || isCompleted) {
            span.className = 'text-primary-hover';
            if (isActive && !isCompleted) {
              spanMention.current = span;
              spanMention.current.style.color =
                'var( --color-mention-progress)';
              setIsOpen(true);
              setMention(mentionText.slice(1));
              isActiveMention = true;
              lastMention = mentionText.slice(1);
            }
            if (isCompleted) {
              tweetText += '$';
            }
            spanRef1.current.appendChild(span);
          } else {
            span.className = 'text-active';
            console.log(notMentions.current);
            const notCompleted = notMentions.current.some(
              (ment) => ment.username === mentionText
            );
            if (!notCompleted) {
              notMentions.current.push({
                username: mentionText,
                span: span,
                checked: false,
                indx: mentionIndex,
                id: mentionIndex,
              });
              setCheckValidUsers(notMentions.current.length - 1);
              console.log('enterre');
            }
            spanRef1.current.appendChild(span);
          }

          lastIndex = mentionIndex + mentionText.length;
        }

        const prevLength = completedMentions.current.length;
        completedMentions.current = completedMentions.current.filter(
          (ment) => ment.checked
        );
        setMentions(completedMentions.current);

        if (prevLength !== completedMentions.current.length) {
          console.log('s');
          if (spanMention.current)
            spanMention.current.style.color = 'var( --color-mention-progress)';
        }
        console.log(completedMentions);
        if (lastIndex < displayedText.length) {
          spanRef1.current.appendChild(
            document.createTextNode(displayedText.slice(lastIndex))
          );
          tweetText += displayedText.slice(lastIndex);
        }

        if (isActiveMention) {
          setIsOpen(true);
          setMention(lastMention);
        } else {
          setIsOpen(false);

          setKeyDown('reset');

          setMention('');
          spanMention.current = null;
        }
        if (text.length > startRedText) {
          setSpanText2(text.slice(startRedText, text.length));
        } else {
          setSpanText2('');
        }
        console.log(tweetText);
      }
    },
    [
      setTweetText,
      setMention,
      setIsDone,
      completedMentions,
      setMentions,
      setIsOpen,
      divRef,
      setKeyDown,
    ]
  );

  useEffect(function () {
    setSpanText1("What's happening?");
  }, []);
  useEffect(
    function () {
      if (mentionIsDone && mention && divRef.current) {
        const currMention = mentionIsDone.split(' ');

        if (spanMention.current && spanMention.current.textContent)
          spanMention.current.textContent = `@` + currMention[0] + ` `;

        const matches = divRef.current?.innerText.matchAll(
          /(?<=^|\s)@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+/g
        ) ?? [''];
        const indx = +(spanMention.current?.getAttribute('data-indx') ?? 0);

        console.log(indx);
        if (indx !== undefined) {
          const text = divRef.current?.innerText;
          console.log(mention, mentionIsDone, text, indx);
          console.log(currMention, mentionIsDone);
          const newText =
            text?.slice(0, indx) +
            `@` +
            currMention[0] +
            ` ` +
            text?.slice(indx + mention.length + 1) +
            ` `;
          divRef.current.textContent = newText;
          setCartAtEnd(divRef.current);

          completedMentions.current.push({
            indx: indx,
            username: `@` + currMention[0],
            checked: true,
            id: +currMention[1],
          });
          setMentions(completedMentions.current);

          spanMention.current = null;
          setIsDone('');
          setIsOpen(false);
          setKeyDown('reset');

          setMention('');
          handleChangeText(newText);
        }
      }
    },
    [
      mentionIsDone,
      spanMention,
      divRef,
      mention,
      setIsDone,
      setMention,
      setIsOpen,
      completedMentions,
      setMentions,
      handleChangeText,
      setKeyDown,
    ]
  );

  useEffect(
    function () {
      if (isSuccess) {
        setSpanText1("What's happening?");
        if (spanRef1.current) {
          spanRef1.current.style.color = 'var(--color-text-inactive)';
          spanRef1.current.innerHTML = "What's happening?";
        }
        setSpanText2('');
        if (divRef.current) divRef.current.innerText = '';
        completedMentions.current = [];
        setMentions(completedMentions.current);

        setIsDone('');
        setIsOpen(false);
        setKeyDown('reset');

        setMention('');
      }
    },
    [
      isSuccess,
      divRef,
      setIsDone,
      setIsOpen,
      setMention,
      setMentions,
      setKeyDown,
    ]
  );
  useEffect(
    function () {
      if (emoji) {
        if (divRef.current) {
          divRef.current.innerText = divRef.current.innerText + emoji;
          handleChangeText(divRef.current.innerText);
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
    if (divRef.current) {
      handleChangeText(divRef.current.innerText, input.data ?? '');
    }
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyDown(e.key);
      }
    }
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
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
