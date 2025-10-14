import React from 'react';
import Avatar from './Avatar';
import UserInfo from './UserInfo';

export default function Header({
  image,
  name,
  username,
  isVerified,
}: {
  image?: string;
  name: string;
  username: string;
  isVerified: boolean;
}) {
  return (
    <div className="flex flex-row items-start gap-3">
      <Avatar image={image} />
      <UserInfo name={name} username={username} isVerified={isVerified} />
    </div>
  );
}
