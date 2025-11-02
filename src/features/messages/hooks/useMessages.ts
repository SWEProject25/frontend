// hooks/useMessages.ts
import { useEffect, useRef, useCallback } from 'react';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';
import { useMessageStore } from '../store/useMessageStore';
import { MESSAGES_SOCKET_EVENTS, MESSAGES_CONSTANTS } from '../constants/api';
import { createMessage as createMessageAPI } from '../api/messages';

export const useMessages = (onError?: (err: any) => void) => {
  const addMessage = useMessageStore((s) => s.addMessage);
  const updateMessage = useMessageStore((s) => s.updateMessage);
  const activeConversationId = useMessageStore((s) => s.activeConversationId);
  const setUserTyping = useMessageStore((s) => s.setUserTyping);
  const removeUserTyping = useMessageStore((s) => s.removeUserTyping);
  const markMessagesAsSeen = useMessageStore((s) => s.markMessagesAsSeen);
  const markAllMessagesAsSeen = useMessageStore((s) => s.markAllMessagesAsSeen);
  const typingTimeoutRef = useRef<number | null>(null);
  const currentUserIdRef = useRef<number | null>(null);

  // Helper to get current user ID
  const getCurrentUserId = useCallback(() => {
    return currentUserIdRef.current;
  }, []);

  useEffect(() => {
    const socket = initSocket();

    // Socket event handlers
    const handleConnect = () => {
      console.log('🟢 WebSocket Connected!', socket.id);
      console.log('✅ Real-time messaging is now active');
      if (activeConversationId) {
        socket.emit(
          MESSAGES_SOCKET_EVENTS.JOIN_CONVERSATION,
          activeConversationId
        );
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔴 WebSocket Disconnected:', reason);
      if (reason === 'io server disconnect') {
        console.warn('⚠️ Server disconnected - you may have been logged out');
        socket.connect();
      }
    };

    const handleConnectError = (err: any) => {
      console.error('❌ WebSocket connection error:', err.message);
      console.log('💡 Tip: Make sure you are logged in');
      onError?.(err);
    };

    const handleError = (err: any) => {
      console.error('❌ WebSocket error:', err);
      if (
        err.message?.includes('unauthorized') ||
        err.message?.includes('401')
      ) {
        console.error('🚫 Authentication error - you may need to log in again');
      }
      onError?.(err);
    };

    const handleMessageCreated = (msg: any) => {
      console.log('📨 New message received via WebSocket:', msg);
      addMessage(msg);

      // If we're currently viewing this conversation and it's not our message, mark it as seen immediately
      const currentUserId = getCurrentUserId();
      if (
        activeConversationId === msg.conversationId &&
        currentUserId &&
        msg.senderId !== currentUserId
      ) {
        console.log(
          '👁️ Auto-marking new message as seen (already viewing conversation)'
        );
        // Use setTimeout to ensure message is added to store first
        setTimeout(() => {
          const socket = getSocket();
          socket.emit(
            MESSAGES_SOCKET_EVENTS.MARK_SEEN,
            { conversationId: msg.conversationId, userId: currentUserId },
            (resp: any) => {
              if (resp?.status === 'success') {
                console.log('✅ New message marked as seen automatically');
                markAllMessagesAsSeen(msg.conversationId);
              }
            }
          );
        }, 100);
      }
    };

    const handleMessageUpdated = (msg: any) => {
      console.log('✏️ Message updated via WebSocket:', msg);
      updateMessage(msg);
    };

    const handleMessagesSeen = (data: any) => {
      console.log('👁️👁️👁️ MESSAGES_SEEN EVENT RECEIVED:', data);
      console.log('👁️ Current user should update UI to show blue checkmarks');
      // Backend sends: { conversationId, userId, timestamp }
      // This means ALL messages in the conversation are now seen by userId
      if (data?.conversationId) {
        console.log(
          '👁️ Marking ALL messages as seen for conversation:',
          data.conversationId
        );
        console.log('👁️ User who saw the messages:', data.userId);
        markAllMessagesAsSeen(data.conversationId);
        console.log(
          '👁️ ✅ Local state updated - checkmarks should turn blue now!'
        );
      }
    };

    const handleUserTyping = (data: any) => {
      console.log('⌨️⌨️⌨️ USER_TYPING EVENT RECEIVED:', data);
      // Backend sends: { conversationId, userId }
      if (data?.conversationId && data?.userId) {
        console.log(
          '⌨️ User',
          data.userId,
          'is typing in conversation',
          data.conversationId
        );
        setUserTyping(data.conversationId, data.userId);
        console.log('⌨️ ✅ Typing indicator should appear now!');
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      console.log('⌨️⌨️⌨️ USER_STOPPED_TYPING EVENT RECEIVED:', data);
      // Backend sends: { conversationId, userId }
      if (data?.conversationId && data?.userId) {
        console.log(
          '⌨️ User',
          data.userId,
          'stopped typing in conversation',
          data.conversationId
        );
        removeUserTyping(data.conversationId, data.userId);
        console.log('⌨️ ✅ Typing indicator should disappear now!');
      }
    };

    // Register event listeners
    socket.on(MESSAGES_SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(MESSAGES_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(MESSAGES_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    socket.on(MESSAGES_SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated);
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
      socket.off(MESSAGES_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
      socket.off(MESSAGES_SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated);
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
    updateMessage,
    setUserTyping,
    removeUserTyping,
    markMessagesAsSeen,
    markAllMessagesAsSeen,
    onError,
  ]);

  // Helper functions
  const joinConversation = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      console.log('🚪 Joining conversation:', conversationId);
      socket.emit(
        MESSAGES_SOCKET_EVENTS.JOIN_CONVERSATION,
        conversationId,
        (resp: any) => {
          if (resp?.status === 'success') {
            console.log('✅ Successfully joined conversation:', conversationId);
            console.log(
              '🎧 Now listening for messagesSeen broadcasts in this room'
            );
          } else {
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
          console.log('📤 Sending via WebSocket:', payload);
          socket.emit(
            MESSAGES_SOCKET_EVENTS.CREATE_MESSAGE,
            payload,
            (resp: any) => {
              console.log('✅ WebSocket response:', resp);
              cb?.(resp);
            }
          );
        } else {
          // Fallback to REST API (for testing while WebSocket is down)
          console.log('⚠️ Socket not connected, using REST API fallback');
          console.log('📤 Sending via REST API:', payload);
          const result = await createMessageAPI(
            payload.conversationId,
            payload.text
          );
          console.log('✅ REST API response:', result);

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
        console.log(
          '💡 Check if POST /conversations/:id/messages endpoint exists'
        );
        cb?.({ status: 'error', error });
      }
    },
    [addMessage]
  );

  const markSeen = useCallback(
    (conversationId: number, userId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      console.log('👁️📤 EMITTING markSeen event:', {
        conversationId,
        userId,
        socketId: socket.id,
      });

      socket.emit(
        MESSAGES_SOCKET_EVENTS.MARK_SEEN,
        { conversationId, userId },
        (resp: any) => {
          if (resp?.status === 'success') {
            console.log('✅ Messages marked as seen - response received');
            // Immediately update local state - mark all messages in this conversation as seen
            console.log(
              '🔄 Updating local state for conversation:',
              conversationId
            );
            markAllMessagesAsSeen(conversationId);
            console.log('👁️✅ Local checkmarks should be blue now!');
          } else {
            console.warn('⚠️ Failed to mark messages as seen:', resp);
          }
          cb?.(resp);
        }
      );
    },
    [markAllMessagesAsSeen]
  );

  const updateMessageSocket = useCallback(
    (
      payload: { id: number; senderId: number; text: string },
      cb?: (resp: any) => void
    ) => {
      const socket = getSocket();
      console.log('✏️ Updating message via WebSocket:', payload);
      socket.emit(
        MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE,
        payload,
        (resp: any) => {
          if (resp?.status === 'success') {
            console.log('✅ Message updated successfully:', resp.data);
          } else {
            console.warn('⚠️ Failed to update message:', resp);
          }
          cb?.(resp);
        }
      );
    },
    []
  );

  const sendTyping = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      console.log('⌨️📤 EMITTING typing event:', {
        conversationId,
        socketId: socket.id,
      });
      socket.emit(
        MESSAGES_SOCKET_EVENTS.TYPING,
        { conversationId },
        (resp: any) => {
          console.log('⌨️📥 typing event response:', resp);
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
    []
  );

  const sendStopTyping = useCallback(
    (conversationId: number, cb?: (resp: any) => void) => {
      const socket = getSocket();
      console.log('⌨️ Sending stop typing indicator:', conversationId);
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
    updateMessage: updateMessageSocket,
    markSeen,
    sendTyping,
    sendStopTyping,
    setCurrentUserId,
  };
};
