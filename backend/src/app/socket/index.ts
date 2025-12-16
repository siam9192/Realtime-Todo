import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import {addUserSocket, setIO } from './socketStore';
import { registerSocketEvents } from './events';

import socketAuth from '../middlewares/socketAuth';
import AppError from '../lib/AppError';
import httpStatus from '../lib/http-status';
import { AuthUser } from '../types';

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(socketAuth());

  setIO(io);

  io.on('connection', async (socket: Socket) => {
    const authUser = socket.data.user as AuthUser;

    try {
      if (!authUser)
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
         
       addUserSocket(authUser.id,socket.id)
       
    } catch (err) {
      console.error('⚠️ Error in connect-user:', err);
      socket.emit('error', {
        message: (err as Error).message || 'Unknown error',
      });
    }

    console.log(
      `🟢 Socket connected: ${socket.id}`,
    );

    // Register custom socket events
    registerSocketEvents(socket);
  });

  return io;
};
