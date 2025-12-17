export const POSTS_TAB = 'Posts';
export const REPLIES_TAB = 'Replies';
export const MEDIA_TAB = 'Media';
export const LIKES_TAB = 'Likes';
export const MENTIONS_TAB = 'Mentions';
export const tabs = [
  { title: 'Posts', value: POSTS_TAB },
  { title: 'Replies', value: REPLIES_TAB },
  { title: 'Media', value: MEDIA_TAB },
  { title: 'Likes', value: LIKES_TAB },
  { title: 'Mentions', value: MENTIONS_TAB },
];
export const myTabs = tabs;
export const userTabs = tabs.filter(
  (tab) => tab.value !== LIKES_TAB && tab.value !== MENTIONS_TAB
);
