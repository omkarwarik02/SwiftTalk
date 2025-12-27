import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthState } from '../store/auth-state';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  constructor(private authState: AuthState) {}

  connect() {
    if (this.socket) return;

    const userId = this.authState.user?.id;
    if (!userId) return;

    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      auth: { userId }
    });
  }

  onOnlineUsers(cb: (users: string[]) => void) {
    this.socket?.on('online-users', cb);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
