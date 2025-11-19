import { io, Socket } from 'socket.io-client';
import { MESSAGES_API_CONFIG } from '../constants/api';

let socket: Socket | null = null;

export function initSocket() {
  if (!socket || !socket.connected) {
    socket = io(MESSAGES_API_CONFIG.WS_URL, {
      withCredentials: true, // Automatically sends cookies (including access_token)
      autoConnect: true,
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
