import React from 'react';

interface DescriptionProps {
  bio: string | null;
}

const Description = ({ bio }: DescriptionProps) => {
  if (!bio) return null;
  return (
    <span className="font-inter text-sm sm:text-base text-color-text-active">
      {bio}
    </span>
  );
};

export default Description;
