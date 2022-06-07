import { SessionModel, SessionObject } from './SessionModel';

export class SessionQueries {
  create = async (session: Omit<SessionObject, '_id' | 'createdAt' | 'updatedAt'>): Promise<SessionObject> => {
    const createdSession = await SessionModel.create(session);
    return createdSession.toObject();
  }

  findByPublicId = async (publicId: string): Promise<SessionObject | undefined> => {
    const user = await SessionModel.findOne({ publicId });
    return user?.toObject();
  }
}

export const sessionQueries = new SessionQueries();
