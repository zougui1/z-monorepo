import { UserPlatformModel, UserPlatformObject } from './UserPlatformModel';

export class UserPlatformQueries {
  create = async (userPlatform: CreateUserPlatformOptions): Promise<UserPlatformObject> => {
    const createdUserPlatform = await UserPlatformModel.create(userPlatform);

    return createdUserPlatform.toObject();
  }
}

export const userPlatformQueries = new UserPlatformQueries();

export interface CreateUserPlatformOptions extends Omit<UserPlatformObject, '_id' | 'createdAt' | 'updatedAt'> {}
