import { io } from 'socket.io-client';

let socketInstance = null;
const localListeners = new Map();

export function getSocket() {
  if (!socketInstance) {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    try {
      socketInstance = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 5000
      });

      socketInstance.on('connect', () => {
        console.log('[Socket.io] Connected to Scan Server on', SOCKET_URL);
        const savedSession = localStorage.getItem('ops_active_day');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            socketInstance.emit('joinSession', parsed.id || 'day-sess-01');
          } catch {}
        }
      });

      socketInstance.on('disconnect', (reason) => {
        console.warn('[Socket.io] Disconnected:', reason);
      });
    } catch (e) {
      console.warn('[Socket] Init fallback:', e);
    }
  }
  return socketInstance;
}

export function joinSession(sessionId) {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('joinSession', sessionId);
  }
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
