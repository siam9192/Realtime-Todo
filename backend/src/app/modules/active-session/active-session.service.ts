import { CreateActiveSessionPayload } from './active-session.interface';
import activeSessionRepository from './active-session.repository';

class ActiveSessionService {
  async createActiveSession(payload: CreateActiveSessionPayload) {
    return await activeSessionRepository.create(payload);
  }
  async getUserAllActiveSessions(userId: string) {
    return await activeSessionRepository.findSessionsByUserId(userId);
  }

  async deleteActiveSession(socketId: string) {
    return await activeSessionRepository.deleteBySocketId(socketId);
  }
}

export default new ActiveSessionService();
