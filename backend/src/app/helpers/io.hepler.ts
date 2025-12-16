import { getIO, getUserSocketIds, getUsersSocketIds } from '../socket/socketStore';

const io = getIO();

export function emitToUsers(userIds: string[], event: string, data: any) {
  if (!userIds || userIds.length === 0) return;

  const socketIds = getUsersSocketIds(userIds);

  if (socketIds.length) {
    io.to(socketIds).emit(event, data);
  }
}
export function emitToUser(userId: string, event: string, data: any) {
  if (!userId) return;

  const socketIds = getUsersSocketIds([userId]);
  if (socketIds.length) {
    io.to(socketIds).emit(event, data);
  }
}