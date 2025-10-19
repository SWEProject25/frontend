'use client';
// import dynamic from 'next/dynamic';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import ProfileLogo from '../../../componenets/ui/home/ProfileLogo';
// const Picker = dynamic(
//   () => {
//     return import('emoji-picker-react');
//   },
//   { ssr: true }
// );

export default function Tweets() {
  const [state, setState] = useState(false);
  return (
    <div>
      <div>Tweets 1</div>
      <div>Tweets 2</div>
      <div>Tweets 3</div>
      <div>Tweets 4</div>
      <div>Tweets 5</div>
      <EmojiPicker open={state} />
    </div>
  );
}
{
  /* {<Picker open={state} emojiStyle="twitter" theme="dark" />} */
}
