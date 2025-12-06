// hooks/useMessages.ts
import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';
import { useMessageStore } from '../store/useMessageStore';
import { MESSAGES_SOCKET_EVENTS, MESSAGES_CONSTANTS } from '../constants/api';
import { createMessage as createMessageAPI } from '../api/messages';

export const useMessages = (onError?: (err: any) => void) => {
  const queryClient = useQueryClient();
  const addMessage = useMessageStore((s) => s.addMessage);
  const addConversation = useMessageStore((s) => s.addConversation);
  const activeConversationId = useMessageStore((s) => s.activeConversationId);
  const setUserTyping = useMessageStore((s) => s.setUserTyping);
  const removeUserTyping = useMessageStore((s) => s.removeUserTyping);
  const markMessagesAsSeen = useMessageStore((s) => s.markMessagesAsSeen);
  const markAllMessagesAsSeen = useMessageStore((s) => s.markAllMessagesAsSeen);
  const typingTimeoutRef = useRef<number | null>(null);
  const currentUserIdRef = useRef<number | null>(null);
  const lastErrorLogRef = useRef<number>(0);

  // Helper to get current user ID
  const getCurrentUserId = useCallback(() => {
    return currentUserIdRef.current;
  }, []);

  useEffect(() => {
    const socket = initSocket();

    // Socket event handlers
    const handleConnect = () => {
      if (activeConversationId) {
        socket.emit(
          MESSAGES_SOCKET_EVENTS.JOIN_CONVERSATION,
          activeConversationId
        );
      }
    };

    const handleDisconnect = (reason: string) => {
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    };

    const handleConnectError = (err: any) => {
      // Only log once every 5 seconds to reduce spam
      const now = Date.now();
      if (now - lastErrorLogRef.current > 5000) {
        console.error(
          '❌ WebSocket connection failed. Please check your authentication.'
        );
        lastErrorLogRef.current = now;
      }
      onError?.(err);
    };

    const handleError = (err: any) => {
      // Only log significant errors
      if (
        err.message?.includes('unauthorized') ||
        err.message?.includes('401')
      ) {
        console.error('🚫 Authentication error - please log in again');
      } else if (err.message && !err.message.includes('xhr')) {
        console.error('❌ WebSocket error:', err.message);
      }
      onError?.(err);
    };

    const handleMessageCreated = async (msg: any) => {
      // Check if this message already exists in the store
      const state = useMessageStore.getState();
      const existingMessages = state.messages[msg.conversationId] || [];
      const messageAlreadyExists = existingMessages.some(
        (m) => m.id === msg.id
      );

      if (messageAlreadyExists) {
        return;
      }

      // Check if conversation exists in our list
      const conversations = state.conversations;
      const conversationExists = conversations.some((conv) => {
        const convId = conv.conversationId || conv.id;
        return convId === msg.conversationId;
      });

      // If conversation doesn't exist, fetch it first
      if (!conversationExists) {
        try {
          const { fetchConversationById } = await import('../api/messages');
          const conversation = await fetchConversationById(msg.conversationId);
          addConversation(conversation);
        } catch (error) {
          console.error('❌ Failed to fetch conversation:', error);
        }
      }

      // Check if we should mark this message as seen immediately
      const currentUserId = getCurrentUserId();
      const shouldMarkAsSeen =
        activeConversationId === msg.conversationId &&
        currentUserId &&
        msg.senderId !== currentUserId;

      // Add the message with correct isSeen status
      if (shouldMarkAsSeen) {
        const seenMessage = { ...msg, isSeen: true };
        addMessage(seenMessage);

        // Emit to backend to broadcast to other user (so they see blue checkmark)
        setTimeout(() => {
          const socket = getSocket();
          socket.emit(
            MESSAGES_SOCKET_EVENTS.MARK_SEEN,
            { conversationId: msg.conversationId, userId: currentUserId },
            (resp: any) => {
              if (resp?.status !== 'success') {
                console.warn('⚠️ Backend failed to mark as seen:', resp);
              }
            }
          );
        }, 50);
      } else {
        // Add message as unseen (we're not viewing this conversation)
        addMessage(msg);

        // Invalidate unseen count queries since there's a new unseen message
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', msg.conversationId],
        });
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
      }
    };

    const handleMessagesSeen = (data: any) => {
      // Backend sends: { conversationId, userId, timestamp }
      // This means ALL messages in the conversation are now seen by userId
      if (data?.conversationId) {
        markAllMessagesAsSeen(data.conversationId);

        // Invalidate unseen count queries since messages were seen
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', data.conversationId],
        });
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
      }
    };

    const handleUserTyping = (data: any) => {
      // Backend sends: { conversationId, userId }
      if (data?.conversationId && data?.userId) {
        setUserTyping(data.conversationId, data.userId);
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      // Backend sends: { conversationId, userId }
      if (data?.conversationId && data?.userId) {
        removeUserTyping(data.conversationId, data.userId);
      }
    };

    const handleConversationCreated = (conversation: any) => {
      // Add normalized id if not present
      const normalizedConversation = {
        ...conversation,
        id: conversation.conversationId || conversation.id,
      };
      addConversation(normalizedConversation);
    };

    const handleNewMessageNotification = async (message: any) => {
      // This event is for messages in conversations we're not currently viewing
      // Backend sends the message object directly, not wrapped
      if (message?.conversationId) {
        // Check if this message was already added by handleMessageCreated
        const state = useMessageStore.getState();
        const existingMessages = state.messages[message.conversationId] || [];
        const messageAlreadyExists = existingMessages.some(
          (m) => m.id === message.id
        );

        if (messageAlreadyExists) {
          return;
        }

        // Check if this conversation exists in our list
        const conversations = state.conversations;
        const conversationExists = conversations.some((conv) => {
          const convId = conv.conversationId || conv.id;
          return convId === message.conversationId;
        });

        // If conversation doesn't exist, fetch it first
        if (!conversationExists) {
          try {
            const { fetchConversationById } = await import('../api/messages');
            const conversation = await fetchConversationById(
              message.conversationId
            );
            addConversation(conversation);
          } catch (error) {
            console.error('❌ Failed to fetch conversation:', error);
          }
        }

        // Add the message to the messages array so unseen count works correctly
        // This message should be marked as unseen since we're not viewing this conversation
        const unseenMessage = { ...message, isSeen: false };
        addMessage(unseenMessage);

        // Invalidate unseen count queries for this conversation and total
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', message.conversationId],
        });
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
      }
    };

    // Register event listeners
    socket.on(MESSAGES_SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(MESSAGES_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(
      MESSAGES_SOCKET_EVENTS.CONVERSATION_CREATED,
      handleConversationCreated
    );
    socket.on(MESSAGES_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    socket.on(
      MESSAGES_SOCKET_EVENTS.NEW_MESSAGE_NOTIFICATION,
      handleNewMessageNotification
    );
    socket.on(MESSAGES_SOCKET_EVENTS.MESSAGES_SEEN, handleMessagesSeen);
    socket.on(MESSAGES_SOCKET_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(
      MESSAGES_SOCKET_EVENTS.USER_STOPPED_TYPING,
      handleUserStoppedTyping
    );
    socket.on(MESSAGES_SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
    socket.on(MESSAGES_SOCKET_EVENTS.ERROR, handleError);

    // Cleanup
    return () => {
      socket.off(MESSAGES_SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(MESSAGES_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(
        MESSAGES_SOCKET_EVENTS.CONVERSATION_CREATED,
        handleConversationCreated
      );
      socket.off(MESSAGES_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
      socket.off(
        MESSAGES_SOCKET_EVENTS.NEW_MESSAGE_NOTIFICATION,
        handleNewMessageNotification
      );
      socket.off(MESSAGES_SOCKET_EVENTS.MESSAGES_SEEN, handleMessagesSeen);
      socket.off(MESSAGES_SOCKET_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(
        MESSAGES_SOCKET_EVENTS.USER_STOPPED_TYPING,
        handleUserStoppedTyping
      );
      socket.off(MESSAGES_SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
      socket.off(MESSAGES_SOCKET_EVENTS.ERROR, handleError);
      disconnectSocket();
    };
  }, [
    activeConversationId,
    addMessage,
    addConversation,
    setUserTyping,
    removeUserTyping,
    markMessagesAsSeen,
    markAllMessagesAsSeen,
    onError,
    getCurrentUserId,
  ]);

  // Helper functions
  const joinConversation = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      socket.emit(
        MESSAGES_SOCKET_EVENTS.JOIN_CONVERSATION,
        conversationId,
        (resp: any) => {
          if (resp?.status !== 'success') {
            console.warn('⚠️ Failed to join conversation:', resp);
          }
          cb?.(resp);
        }
      );
    },
    []
  );

  const createMessage = useCallback(
    async (
      payload: { conversationId: number; text: string; senderId: number },
      cb?: (resp: any) => void
    ) => {
      try {
        const socket = getSocket();

        if (socket.connected) {
          // Use WebSocket (real-time)
          socket.emit(
            MESSAGES_SOCKET_EVENTS.CREATE_MESSAGE,
            payload,
            (resp: any) => {
              cb?.(resp);
            }
          );
        } else {
          // Fallback to REST API (for testing while WebSocket is down)
          const result = await createMessageAPI(
            payload.conversationId,
            payload.text
          );

          // Manually add message to store (since we won't get socket event)
          if (result?.data) {
            addMessage(result.data);
            cb?.({ status: 'success', data: result.data });
          } else {
            cb?.(result);
          }
        }
      } catch (error: any) {
        console.error('❌ Failed to create message:', error.message);
        cb?.({ status: 'error', error });
      }
    },
    [addMessage]
  );

  const markSeen = useCallback(
    (conversationId: number, userId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();

      socket.emit(
        MESSAGES_SOCKET_EVENTS.MARK_SEEN,
        { conversationId, userId },
        (resp: any) => {
          if (resp?.status === 'success') {
            // Immediately update local state - mark all messages in this conversation as seen
            markAllMessagesAsSeen(conversationId);

            // Invalidate unseen count queries to refresh badges
            queryClient.invalidateQueries({
              queryKey: ['messages', 'unseen', conversationId],
            });
            queryClient.invalidateQueries({
              queryKey: ['messages', 'unseen', 'total'],
            });
          } else {
            console.warn('⚠️ Failed to mark messages as seen:', resp);
          }
          cb?.(resp);
        }
      );
    },
    [markAllMessagesAsSeen, queryClient]
  );

  const sendTyping = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      socket.emit(
        MESSAGES_SOCKET_EVENTS.TYPING,
        { conversationId },
        (resp: any) => {
          cb?.(resp);
        }
      );

      if (typeof window !== 'undefined') {
        if (typingTimeoutRef.current) {
          window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
          sendStopTyping(conversationId);
        }, MESSAGES_CONSTANTS.TYPING_TIMEOUT);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sendStopTyping = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      socket.emit(
        MESSAGES_SOCKET_EVENTS.STOP_TYPING,
        { conversationId },
        (resp: any) => {
          cb?.(resp);
        }
      );
    },
    []
  );

  const setCurrentUserId = useCallback((userId: number) => {
    currentUserIdRef.current = userId;
  }, []);

  return {
    joinConversation,
    createMessage,
    markSeen,
    sendTyping,
    sendStopTyping,
    setCurrentUserId,
  };
};
