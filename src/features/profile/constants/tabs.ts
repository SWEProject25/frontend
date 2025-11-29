export const POSTS_TAB = 'Posts';
export const REPLIES_TAB = 'Replies';
export const MEDIA_TAB = 'Media';
export const LIKES_TAB = 'Likes';
export const userTabs = [
  { title: 'Posts', value: POSTS_TAB },
  { title: 'Replies', value: REPLIES_TAB },
  { title: 'Media', value: MEDIA_TAB },
];
export const myTabs = [...userTabs, { title: 'Likes', value: LIKES_TAB }];
