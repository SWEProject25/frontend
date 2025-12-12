'use client';
import { createContext, useContext } from 'react';
import { createAddTweetSelectors } from './useAddPostStore';

type AddPostType = ReturnType<typeof createAddTweetSelectors>;
export const AddPostStoreContext = createContext<AddPostType | null>(null);

export const useAddPostContext = () => {
  const context = useContext(AddPostStoreContext);
  if (!context) throw new Error('Missing Store context');
  return context;
};
