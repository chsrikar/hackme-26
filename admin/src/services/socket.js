import { io } from 'socket.io-client';

let socketInstance = null;
const localListeners = new Map();

export function getSocket() {
  if (!socketInstance) {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    try {
      socketInstance = io(SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 3,
        timeout: 3000
      });
    } catch (e) {
      console.warn('[Socket] Init fallback:', e);
    }
  }
  return socketInstance;
}

export function subscribeToEvent(eventName, callback) {
  const socket = getSocket();
  if (socket) socket.on(eventName, callback);

  if (!localListeners.has(eventName)) {
    localListeners.set(eventName, new Set());
  }
  localListeners.get(eventName).add(callback);

  return () => {
    if (socket) socket.off(eventName, callback);
    if (localListeners.has(eventName)) {
      localListeners.get(eventName).delete(callback);
    }
  };
}

export function emitMockEvent(eventName, data) {
  if (localListeners.has(eventName)) {
    localListeners.get(eventName).forEach((cb) => {
      try { cb(data); } catch (err) { console.error(err); }
    });
  }
}
