import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';

class ActiveSessionRepository {
  private activeSession = prisma.activeSession;

  async create(data: Prisma.ActiveSessionUncheckedCreateInput) {
    return await this.activeSession.create({
      data: data,
    });
  }

  async deleteBySocketId(id: string) {
    await this.activeSession.delete({
      where: {
        socketId: id,
      },
    });
    return null;
  }

  async findSessionsByUserId(id: string) {
    return await this.activeSession.findMany({
      where: {
        userId: id,
      },
    });
  }
}

export default new ActiveSessionRepository();
