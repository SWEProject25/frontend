'use client';
import { useEffect, useRef } from 'react';

export function useOutsideModal(
  closeHandler: () => void,
  listenCapturing = true
) {
  const ref = useRef<null | HTMLDivElement>(null);
  useEffect(
    function () {
      function clickHandler(e: MouseEvent) {
        if (
          ref.current &&
          e.target instanceof HTMLElement &&
          !ref.current.contains(e.target)
        ) {
          closeHandler();
        }
      }
      document.addEventListener('click', clickHandler, listenCapturing);
      return () => {
        document.removeEventListener('click', clickHandler, listenCapturing);
      };
    },
    [closeHandler, listenCapturing]
  );

  return ref;
}
