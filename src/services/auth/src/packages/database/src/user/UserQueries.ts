import type { Types } from 'mongoose';

import { UserObject, UserModel, PublicUserObject } from './UserModel';
import type { UserPlatformObject } from '../userPlatform';
import type { SessionObject } from '../session';

export class UserQueries {
  create = async (user: CreateUserOptions): Promise<PublicUserObject> => {
    const createdUser = await UserModel.create(user);
    const { password, ...publicUser } = createdUser.toObject<UserObject>();

    return publicUser;
  }

  async findByEmail(
    email: string,
    options?: (FindByEmailOptions & { withPassword?: false | undefined }) | undefined,
  ): Promise<(Omit<PublicUserObject, 'platforms'> & { platforms: UserPlatformObject[] }) | undefined>;
  async findByEmail(
    email: string,
    options: FindByEmailOptions & { withPassword: true },
  ): Promise<(Omit<UserObject, 'platforms'> & { platforms: UserPlatformObject[] }) | undefined>;
  async findByEmail(
    email: string,
    options: FindByEmailOptions | undefined = {},
  ): Promise<(Omit<PublicUserObject, 'platforms'> & { platforms: UserPlatformObject[] }) | undefined> {
    const { withPassword = false } = options;
    const user = await UserModel
      .findOne({ email }, { password: Number(withPassword) })
      .populate('platforms');

    return user?.toObject();
  }

  addSessionAndPlatform = async (userId: Types.ObjectId, session: SessionObject, platform: UserPlatformObject): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: {
        platforms: platform._id,
        sessions: session._id,
      },
    }, { password: 0 });
  }

  findBySessionId = async (sessionId: Types.ObjectId): Promise<PublicUserObject | undefined> => {
    const user = await UserModel.findOne({ sessions: { $in: sessionId } }, { password: 0 });

    return user?.toObject();
  }
}

export const userQueries = new UserQueries();

export interface CreateUserOptions {
  name: string;
  password: string;
  email: string;
  platforms: UserPlatformObject[];
  sessions: SessionObject[];
}

export interface FindByEmailOptions {
  withPassword?: boolean | undefined;
}
