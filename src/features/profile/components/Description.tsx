import React from 'react';

interface DescriptionProps {
  bio: string;
}

const Description = ({ bio }: DescriptionProps) => {
  return (
    <span className="font-inter text-base text-color-text-active">{bio}</span>
  );
};

export default Description;
