// hooks/useMessages.ts
import { useEffect, useRef, useCallback } from 'react';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';
import { useMessageStore } from '../store/useMessageStore';
import { MESSAGES_SOCKET_EVENTS, MESSAGES_CONSTANTS } from '../constants/api';
import { createMessage as createMessageAPI } from '../api/messages';

export const useMessages = (onError?: (err: any) => void) => {
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
      // Only log non-transport errors to reduce noise
      if (reason !== 'transport error' && reason !== 'transport close') {
        console.log('🔴 WebSocket Disconnected:', reason);
      }
      if (reason === 'io server disconnect') {
        console.warn('⚠️ Server disconnected - you may have been logged out');
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
      console.log('📨 MESSAGE_CREATED event received:', {
        messageId: msg.id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        text: msg.text?.substring(0, 30),
      });

      // Check if this message already exists in the store
      const state = useMessageStore.getState();
      const existingMessages = state.messages[msg.conversationId] || [];
      const messageAlreadyExists = existingMessages.some(
        (m) => m.id === msg.id
      );

      if (messageAlreadyExists) {
        console.log(
          '⚠️ MESSAGE_CREATED: Message already exists, skipping duplicate:',
          msg.id
        );
        return;
      }

      console.log('✅ MESSAGE_CREATED: Message is new, will add to store');

      // Check if conversation exists in our list
      const conversations = state.conversations;
      const conversationExists = conversations.some((conv) => {
        const convId = conv.conversationId || conv.id;
        return convId === msg.conversationId;
      });

      // If conversation doesn't exist, fetch it first
      if (!conversationExists) {
        console.log(
          '🆕 Conversation not in list, fetching before adding message...'
        );
        try {
          const { fetchConversationById } = await import('../api/messages');
          const conversation = await fetchConversationById(msg.conversationId);
          console.log('✅ Fetched conversation:', conversation);
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
        console.log(
          '👁️ Received message while viewing conversation - marking as seen immediately'
        );
        const seenMessage = { ...msg, isSeen: true };
        addMessage(seenMessage);

        // Emit to backend to broadcast to other user (so they see blue checkmark)
        setTimeout(() => {
          const socket = getSocket();
          console.log(
            '📤 Emitting MARK_SEEN to backend for conversation:',
            msg.conversationId
          );
          socket.emit(
            MESSAGES_SOCKET_EVENTS.MARK_SEEN,
            { conversationId: msg.conversationId, userId: currentUserId },
            (resp: any) => {
              if (resp?.status === 'success') {
                console.log('✅ Backend confirmed: messages marked as seen');
                // Backend will broadcast messagesSeen event to sender
              } else {
                console.warn('⚠️ Backend failed to mark as seen:', resp);
              }
            }
          );
        }, 50);
      } else {
        // Add message as unseen (we're not viewing this conversation)
        addMessage(msg);
      }
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

    const handleConversationCreated = (conversation: any) => {
      console.log('🆕 New conversation created:', conversation);
      // Add normalized id if not present
      const normalizedConversation = {
        ...conversation,
        id: conversation.conversationId || conversation.id,
      };
      addConversation(normalizedConversation);
      console.log('✅ Conversation added to list');
    };

    const handleNewMessageNotification = async (message: any) => {
      console.log('🔔 NEW_MESSAGE_NOTIFICATION event received:', {
        messageId: message?.id,
        conversationId: message?.conversationId,
        senderId: message?.senderId,
        text: message?.text?.substring(0, 30),
      });
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
          console.log(
            '⚠️ NEW_MESSAGE_NOTIFICATION: Message already exists (added by MESSAGE_CREATED), skipping duplicate:',
            message.id
          );
          return;
        }

        console.log(
          '✅ NEW_MESSAGE_NOTIFICATION: Message is new, will add to store'
        );

        // Check if this conversation exists in our list
        const conversations = state.conversations;
        const conversationExists = conversations.some((conv) => {
          const convId = conv.conversationId || conv.id;
          return convId === message.conversationId;
        });

        // If conversation doesn't exist, fetch it first
        if (!conversationExists) {
          console.log('🆕 Conversation not in list, fetching...');
          try {
            const { fetchConversationById } = await import('../api/messages');
            const conversation = await fetchConversationById(
              message.conversationId
            );
            console.log('✅ Fetched conversation:', conversation);
            addConversation(conversation);
          } catch (error) {
            console.error('❌ Failed to fetch conversation:', error);
          }
        }

        // Add the message to the messages array so unseen count works correctly
        // This message should be marked as unseen since we're not viewing this conversation
        console.log(
          '📥 Adding notification message to messages array for unseen count'
        );
        const unseenMessage = { ...message, isSeen: false };
        addMessage(unseenMessage);

        // The addMessage function already updates the conversation's lastMessage
        // and sorts conversations by most recent
        console.log('✅ Message added - unseen count should now be correct');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    markSeen,
    sendTyping,
    sendStopTyping,
    setCurrentUserId,
  };
};
