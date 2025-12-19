import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { addUserSocket, setIO } from './socketStore';
import { registerSocketEvents } from './events';

import socketAuth from '../middlewares/socketAuth';
import { AuthUser } from '../types';

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
  });

  io.use(socketAuth());

  setIO(io);

  io.on('connection', async (socket: Socket) => {
    const authUser = socket.data.user as AuthUser;

    addUserSocket(authUser.id, socket.id);

    console.log(`🟢 Socket connected: ${socket.id}`);

    // Register custom socket events
    registerSocketEvents(socket);
  });

  return io;
};
