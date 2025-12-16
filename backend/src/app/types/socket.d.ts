import { Socket as OriginalSocket } from 'socket.io';
import { AuthUser } from '.';

declare module 'socket.io' {
  interface Socket {
    data: {
      user: AuthUser;
    };
  }
}
