// Temporary utility to manually add mock messages for testing UI
// Use this until backend implements POST /messages endpoint

import { useMessageStore } from '../store/useMessageStore';

export const addMockMessage = (
  conversationId: number,
  senderId: number,
  text: string
) => {
  const mockMessage = {
    id: Date.now(), // Use timestamp as temporary ID
    conversationId,
    senderId,
    text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeletedU1: false,
    isDeletedU2: false,
    isSeen: false,
  };

  // Add to store
  useMessageStore.getState().addMessage(mockMessage);

  console.log('✅ Mock message added to store:', mockMessage);

  return mockMessage;
};

// Add this to window for easy testing in console
if (typeof window !== 'undefined') {
  (window as any).addMockMessage = addMockMessage;
}
