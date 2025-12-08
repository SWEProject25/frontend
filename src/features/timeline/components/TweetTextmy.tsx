'use client';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import {
  useMention,
  useActions,
  useIsOpen,
  useMentionIsDone,
} from '@/features/timeline/store/useMentionStore';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '@/features/timeline/constants/tweetConstants';
import { useEmoji } from '@/features/media/store/useMedia';

const startRedText = MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH;

function getCurrCursorPos(div: HTMLDivElement) {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return 0;

  let pos = selection.anchorOffset;
  let node = selection.anchorNode;

  while (node && node !== div) {
    let siblingNode = node.previousSibling;

    while (siblingNode) {
      pos += siblingNode.textContent?.length ?? 0;
      siblingNode = siblingNode.previousSibling;
    }
    node = node.parentNode ?? div;
  }
  return pos;
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
  const { setMention, setIsOpen, setIsDone } = useActions();
  const spanMention = useRef<null | HTMLSpanElement>(null);
  type mentionSPan = {
    indx: number;
    username: string;
  };
  const completedMentions = useRef<mentionSPan[]>([]);
  // const [mentionIsOpen, setMentionIsOpen] = useState(false);
  const emoji = useEmoji();
  const handleChangeText = useCallback(
    (text: string, lastData: string | null = null) => {
      const lastMatch = text.match(
        /(?<=^|\s)@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+$/
      ) ?? [''];
      // const index = lastMatch.index;
      // const lastMention = lastMatch[0].slice(1);
      // const isActiveMention =
      //   lastMatch &&
      //   lastMatch.length <= 10 &&
      //   text.length + 10 <= startRedText &&
      //   !mentionIsDone;
      let isActiveMention = false;
      let lastMention = '';

      if (spanRef1.current) {
        if (text.length === 0) {
          console.log('erase');
          setSpanText1("What's happening?");
          spanRef1.current.style.color = 'var(--color-text-inactive)';
          spanRef1.current.innerHTML = "What's happening?";
          setMention('');
          setIsDone('');
          completedMentions.current = [];
          setIsOpen(false);
          spanMention.current = null;
          setSpanText2('');
          setTweetText('');
          return;
        }
        setTweetText(text);
        // if (divRef.current) divRef.current.textContent = text;
        spanRef1.current.style.color = 'var(--color-text-active)';
        spanRef1.current.innerHTML = '';
        const displayedText = text.slice(0, startRedText);
        let lastIndex = 0;
        const matchRegex = /@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+/g;
        let match;
        let cursor = 0;
        if (divRef.current) cursor = getCurrCursorPos(divRef.current);
        while ((match = matchRegex.exec(displayedText)) !== null) {
          const mentionIndex = match.index;
          const mentionText = match[0];
          const mentionEndIndx = mentionIndex + mentionText.length;

          if (mentionIndex > lastIndex) {
            const node = document.createTextNode(
              displayedText.slice(lastIndex, mentionIndex)
            );
            spanRef1.current.appendChild(node);
          }
          const isCompleted = completedMentions.current.some(
            (ment) =>
              ment.indx === mentionIndex && ment.username === mentionText
          );
          // const isActive = isActiveMention && mentionIndex === index;
          const isActive = cursor >= mentionIndex && cursor <= mentionEndIndx;
          // setIsOpen(true);
          // setMention(lastMatch);
          if (isActive || isCompleted) {
            const span = document.createElement('span');
            span.textContent = mentionText;
            span.className = 'text-primary-hover';
            span.setAttribute(
              'data-mention',
              `${isCompleted ? 'completed' : 'active'}`
            );
            span.setAttribute('data-indx', `${mentionIndex}`);
            if (isActive) {
              spanMention.current = span;
              setIsOpen(true);
              setMention(mentionText);
              isActiveMention = true;
              lastMention = mentionText;
            }
            // spanRef1.current.textContent = text.slice(0, index);
            spanRef1.current.appendChild(span);
          } else
            spanRef1.current.appendChild(document.createTextNode(mentionText));

          lastIndex = mentionIndex + mentionText.length;
          // setMention(lastData ?? '');
          // spanRef1.current.innerHTML += `<span class='text-primary-hover'>${mention}</span>`;

          // if (spanMention.current && spanMention.current.textContent) {
          //   spanMention.current.text
        }
        if (lastIndex < displayedText.length)
          spanRef1.current.appendChild(
            document.createTextNode(displayedText.slice(lastIndex))
          );
        if (isActiveMention) {
          setIsOpen(true);
          setMention(lastMention);
        } else {
          setIsOpen(false);
          setMention('');
          spanMention.current = null;
        }
        if (text.length > startRedText) {
          console.log('inside length greater than 10');

          console.log(text, 'after slicing');
          setSpanText2(text.slice(startRedText, text.length));
        } else {
          setSpanText2('');
        }
      }
    },
    [
      setTweetText,
      setMention,
      setIsDone,
      completedMentions,
      setIsOpen,
      mentionIsDone,
      divRef,
    ]
  );

  useEffect(function () {
    setSpanText1("What's happening?");
  }, []);
  useEffect(
    function () {
      if (mentionIsDone && mention && divRef.current) {
        if (spanMention.current && spanMention.current.textContent)
          spanMention.current.textContent = `@` + mentionIsDone;
        const indx = divRef.current?.innerText.match(
          /(?<=^|\s)@[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+$/
        )?.index;

        if (indx !== undefined) {
          const text = divRef.current?.innerText;
          console.log(mention, mentionIsDone, text, indx);

          const newText =
            text?.slice(0, indx) +
            `@` +
            mentionIsDone +
            text?.slice(indx + mention.length + 1) +
            ` `;
          divRef.current.textContent = newText;
          setCartAtEnd(divRef.current);

          completedMentions.current.push({
            indx: indx,
            username: `@` + mentionIsDone,
          });
          spanMention.current = null;
          setIsDone('');
          setIsOpen(false);
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
      handleChangeText,
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
        setIsDone('');
        setIsOpen(false);
        setMention('');
        // setTweetText('');
      }
    },
    [isSuccess, divRef, setIsDone, setIsOpen, setMention]
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
      (node.getAttribute('data-mention') === 'completed' ||
        node.getAttribute('data-mention') === 'active')
    ) {
      completedMentions.current.filter(
        (mention) =>
          mention.indx !== +(node.getAttribute('data-indx') ?? -1) ||
          mention.username !== node.textContent
      );

      console.log('asqq');
      e.preventDefault();
      node.remove();
      setMention('');
      setIsDone('');
      setIsOpen(false);
      if (divRef.current?.textContent)
        handleChangeText(divRef.current.textContent);
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
