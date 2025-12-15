import { getSocket } from '@/features/messages/services/socket';
import {
  OPTIMISTIC_TYPES,
  REAL_TIME_TWEETS_SOCKET_EVENTS,
} from '../constants/api';
import { useCallback, useEffect } from 'react';
import { useRealTimeTweet } from '../optimistics/RealTimeTweet';

export const useRealTimeTweets = () => {
  const joinPost = useCallback((postId: number, cb?: (resp: any) => void) => {
    try {
      const socket = getSocket();
      if (!socket.connected) {
        console.warn('Socket not connected, cannot join post:', postId);
        return;
      }
      socket.emit(
        REAL_TIME_TWEETS_SOCKET_EVENTS.JOIN_POST,
        postId,
        (resp: any) => {
          if (resp?.status !== 'success')
            console.warn('failed to join post', resp);
          cb?.(resp);
        }
      );
    } catch (err) {
      console.warn('Socket not initialized, cannot join post:', postId);
    }
  }, []);

  const leavePost = useCallback((postId: number, cb?: (resp: any) => void) => {
    try {
      const socket = getSocket();
      if (!socket.connected) {
        console.warn('Socket not connected, cannot leave post:', postId);
        return;
      }
      socket.emit(
        REAL_TIME_TWEETS_SOCKET_EVENTS.LEAVE_POST,
        postId,
        (resp: any) => {
          if (resp?.status !== 'success')
            console.warn('failed to leave post', resp);
          cb?.(resp);
        }
      );
    } catch (err) {
      console.warn('Socket not initialized, cannot leave post:', postId);
    }
  }, []);

  const usePostUpdates = (
    postId: number | null,
    userId: number,
    type = 'Post',
    parentId = -1
  ) => {
    usePostLike(postId, userId, type, parentId);
    usePostReplies(postId, userId, type, parentId);
    usePostReposts(postId, userId, type, parentId);
  };
  const usePostLike = (
    postId: number | null,
    userId: number,
    type = 'Post',
    parentId = -1
  ) => {
    const { onMutate } = useRealTimeTweet();

    useEffect(() => {
      if (!postId) return;

      try {
        const socket = getSocket();
        if (!socket.connected) {
          console.warn(
            'Socket not connected, cannot listen to post like:',
            postId
          );
          return;
        }
        const onLike = (data: { postId: number; count: number }) => {
          console.log(data, 'Likkkkkkkeeeeeeee', type);
          if (postId === data.postId)
            onMutate(
              OPTIMISTIC_TYPES.LIKE,
              postId,
              userId,
              data.count,
              type,
              parentId
            );
        };
        socket.on(REAL_TIME_TWEETS_SOCKET_EVENTS.LIKE_UPDATE, onLike);

        return () => {
          socket.off(REAL_TIME_TWEETS_SOCKET_EVENTS.LIKE_UPDATE, onLike);
        };
      } catch (err) {
        console.warn(
          'Socket not initialized, cannot listen to post like:',
          postId
        );
      }
    }, [postId, userId, onMutate, type, parentId]);
  };

  const usePostReplies = (
    postId: number | null,
    userId: number,
    type = 'Post',
    parentId = -1
  ) => {
    const { onMutate } = useRealTimeTweet();

    useEffect(() => {
      if (!postId) return;

      try {
        const socket = getSocket();
        if (!socket.connected) {
          console.warn(
            'Socket not connected, cannot listen to post Reply:',
            postId
          );
          return;
        }
        const onComment = (data: { postId: number; count: number }) => {
          console.log(data, 'COmmment');
          if (postId === data.postId)
            onMutate(
              OPTIMISTIC_TYPES.REPLY,
              postId,
              userId,
              data.count,
              type,
              parentId
            );
        };
        socket.on(REAL_TIME_TWEETS_SOCKET_EVENTS.COMMENT_UPDATE, onComment);

        return () => {
          socket.off(REAL_TIME_TWEETS_SOCKET_EVENTS.COMMENT_UPDATE, onComment);
        };
      } catch (err) {
        console.warn(
          'Socket not initialized, cannot listen to post reply:',
          postId
        );
      }
    }, [postId, userId, onMutate, type, parentId]);
  };

  const usePostReposts = (
    postId: number | null,
    userId: number,
    type = 'Post',
    parentId = -1
  ) => {
    const { onMutate } = useRealTimeTweet();

    useEffect(() => {
      if (!postId) return;

      try {
        const socket = getSocket();
        if (!socket.connected) {
          console.warn(
            'Socket not connected, cannot listen to post repost:',
            postId
          );
          return;
        }
        const onRepost = (data: { postId: number; count: number }) => {
          console.log(data, 'reposssst');
          if (postId === data.postId)
            onMutate(
              OPTIMISTIC_TYPES.REPOST,
              postId,
              userId,
              data.count,
              type,
              parentId
            );
        };
        socket.on(REAL_TIME_TWEETS_SOCKET_EVENTS.REPOST_UPDATE, onRepost);

        return () => {
          socket.off(REAL_TIME_TWEETS_SOCKET_EVENTS.REPOST_UPDATE, onRepost);
        };
      } catch (err) {
        console.warn(
          'Socket not initialized, cannot listen to post repost:',
          postId
        );
      }
    }, [postId, userId, onMutate, type, parentId]);
  };
  return {
    joinPost,
    leavePost,
    usePostUpdates,
  };
};
