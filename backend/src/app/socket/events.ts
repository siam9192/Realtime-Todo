import { Socket } from 'socket.io';
import activeSessionService from '../modules/active-session/active-session.service';
import { AuthUser } from '../types';
import { removeUserSocket } from './socketStore';

export const registerSocketEvents = (socket: Socket) => {
  const authUser = socket.data.user as AuthUser;

  // Handle disconnect
  socket.on('disconnect', async (reason) => {
    console.log(`🔴 Socket disconnected: ${socket.id}, reason: ${reason}`);
    if (authUser) {
      removeUserSocket(authUser.id, socket.id);
    }
  });
};
