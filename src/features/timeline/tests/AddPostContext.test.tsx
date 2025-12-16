import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import {
  AddPostStoreContext,
  useAddPostContext,
} from '../store/AddPostContext';
import {
  createAddTweetStore,
  createAddTweetSelectors,
} from '../store/useAddPostStore';

describe('AddPostContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('AddPostStoreContext', () => {
    it('should be a React context', () => {
      expect(AddPostStoreContext).toBeDefined();
      expect(AddPostStoreContext.Provider).toBeDefined();
      expect(AddPostStoreContext.Consumer).toBeDefined();
    });

    it('should have default value of null', () => {
      // Render a consumer without provider
      let contextValue: any = 'not-null';

      render(
        <AddPostStoreContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AddPostStoreContext.Consumer>
      );

      expect(contextValue).toBeNull();
    });

    it('should provide value to consumers', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);
      let contextValue: any = null;

      render(
        <AddPostStoreContext.Provider value={selectors}>
          <AddPostStoreContext.Consumer>
            {(value) => {
              contextValue = value;
              return null;
            }}
          </AddPostStoreContext.Consumer>
        </AddPostStoreContext.Provider>
      );

      expect(contextValue).not.toBeNull();
    });
  });

  describe('useAddPostContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useAddPostContext());
      }).toThrow('Missing Store context');
    });

    it('should return context when inside provider', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toBe(selectors);
    });

    it('should provide useTweetText selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useTweetText).toBeDefined();
    });

    it('should provide useMedia selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useMedia).toBeDefined();
    });

    it('should provide useIsSending selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useIsSending).toBeDefined();
    });

    it('should provide useIsSuccess selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useIsSuccess).toBeDefined();
    });

    it('should provide useError selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useError).toBeDefined();
    });

    it('should provide useActions selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useActions).toBeDefined();
    });

    it('should provide useMentions selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useMentions).toBeDefined();
    });

    it('should provide useEmoji selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useEmoji).toBeDefined();
    });

    it('should provide useMention selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useMention).toBeDefined();
    });

    it('should provide useCurrentKey selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useCurrentKey).toBeDefined();
    });

    it('should provide useMentionIsDone selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useMentionIsDone).toBeDefined();
    });

    it('should provide useIsOpen selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.useIsOpen).toBeDefined();
    });

    it('should provide usePlaceHolder selector', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AddPostStoreContext.Provider value={selectors}>
          {children}
        </AddPostStoreContext.Provider>
      );

      const { result } = renderHook(() => useAddPostContext(), { wrapper });

      expect(result.current.usePlaceHolder).toBeDefined();
    });
  });
});
