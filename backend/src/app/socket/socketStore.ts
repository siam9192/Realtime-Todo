import { Server } from 'socket.io';
import { ConnectedUser } from '../types';

let io: Server | null = null;


type UsersMap = Map<string, Set<string>>;

const users: UsersMap = new Map();


export function addUserSocket(userId: string, socketId: string) {
  if (!users.has(userId)) {
    users.set(userId, new Set());
  }
  users.get(userId)?.add(socketId);
}

export function removeUserSocket(userId: string, socketId: string) {
  const sockets = users.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);
  if (sockets.size === 0) {
    users.delete(userId);
  }
}

export function getUserSocketIds(userId: string): string[] {
  return Array.from(users.get(userId) ?? []);
}
export function getUsersSocketIds(userIds: string[]): string[] {
  
  const uniqueUserIds = Array.from(new Set(userIds));

  const socketIds: string[] = [];

  uniqueUserIds.forEach(userId => {
    const ids = users.get(userId);
    if (ids) socketIds.push(...ids);
  });

  
  return Array.from(new Set(socketIds));
}




export function isUserConnected(userId: string): boolean {
  return users.has(userId);
}

export function getAllConnectedUsers(): ConnectedUser[] {
  return Array.from(users.entries()).map(([userId, socketIds]) => ({
    userId,
    socketIds: Array.from(socketIds),
  }));
}



export const setIO = (ioInstance: Server) => {
  io = ioInstance;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
