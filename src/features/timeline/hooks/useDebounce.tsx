import { useEffect, useState } from 'react';

export default function useDebounce(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(
    function () {
      const id = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(id);
    },
    [value, delay]
  );
  return debounced;
}
