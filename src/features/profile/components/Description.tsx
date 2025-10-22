import React from 'react';

interface DescriptionProps {
  bio: string;
}

const Description: React.FC<DescriptionProps> = ({ bio }) => {
  return (
    <span className="font-inter text-base text-color-text-active">{bio}</span>
  );
};

export default Description;
