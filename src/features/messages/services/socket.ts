import { io, Socket } from 'socket.io-client';
import { MESSAGES_API_CONFIG } from '../constants/api';

let socket: Socket | null = null;
let connectionFailed = false;

export function initSocket() {
  // If connection previously failed, don't try again
  if (connectionFailed) {
    return null as any;
  }

  if (!socket || !socket.connected) {
    socket = io(MESSAGES_API_CONFIG.WS_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: false, // Disable automatic reconnection to prevent error spam
      transports: ['websocket', 'polling'],
      timeout: 5000, // 5 second timeout
    });

    // Track connection failures
    socket.on('connect_error', () => {
      connectionFailed = true;
      socket?.disconnect();
      socket = null;
    });

    socket.on('connect', () => {
      connectionFailed = false;
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
