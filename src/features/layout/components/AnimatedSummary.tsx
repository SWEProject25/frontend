import React, { useEffect, useState } from 'react';

export default function AnimatedSummary({
  content,
}: {
  content: string | null;
}) {
  const [displayed, setDisplayed] = useState<string>('');
  const [erase, setErase] = useState(false);

  useEffect(() => {
    // Erase effect
    setErase(true);
    setDisplayed('');
    const eraseTimeout = setTimeout(() => {
      setErase(false);
    }, 200); // quick erase
    return () => clearTimeout(eraseTimeout);
  }, [content]);

  useEffect(() => {
    // Typewriter effect after erase
    if (!erase && content) {
      let i = 0;
      setDisplayed('');
      const typeInterval = setInterval(() => {
        setDisplayed((prev) => (content ? content.slice(0, i) : ''));
        i++;
        if (!content || i > content.length) clearInterval(typeInterval);
      }, 12); // high speed
      return () => clearInterval(typeInterval);
    }
  }, [erase, content]);

  return (
    <div className="relative min-h-[48px]">
      <div
        className={`transition-all duration-300 ease-in-out ${
          erase ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
        }`}
        style={{
          transitionProperty: 'opacity, transform, filter',
        }}
      >
        <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed animate-fade-in">
          {displayed || (!erase && !content ? 'No summary available.' : '')}
        </p>
      </div>
    </div>
  );
}
