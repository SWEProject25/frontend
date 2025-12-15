import { StoreApi, UseBoundStore } from 'zustand';
import { AddPostState, createAddTweetStore } from './useAddPostStore';

const registry = new Map<number, UseBoundStore<StoreApi<AddPostState>>>();

export function getAddReplyStore(key: number) {
  if (!registry.has(key)) {
    registry.set(key, createAddTweetStore());
  }
  return registry.get(key);
}
export function clearReplyStore(key: number) {
  registry.delete(key);
}
