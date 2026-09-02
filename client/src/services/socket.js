import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('📡 Connected to MatchMates game server:', this.socket.id);
      });

      this.socket.on('disconnect', (reason) => {
        this.connected = false;
        console.log('🔌 Disconnected from game server:', reason);
      });

      this.socket.on('connect_error', (err) => {
        console.warn('⚠️ Socket connection error:', err.message);
      });
    }
    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      socket.emit(event, data, (response) => {
        if (response && response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  on(event, callback) {
    const socket = this.getSocket();
    socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
