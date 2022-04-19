import _ from 'lodash';

import { UserModel, User, UserDocument } from './UserModel';

class UserQueries {
  create = async (user: User): Promise<UserDocument> => {
    return await UserModel.create(user);
  }

  findOrCreate = async (user: User): Promise<UserDocument> => {
    const foundUser = await UserModel.findOne({
      name: user.name,
    });

    if (foundUser) {
      return foundUser;
    }

    return await this.create(user);
  }

  // TODO the profileUrl may change even if the origin (website name and URL) does not change
  findOrUpsert = async (user: User): Promise<UserDocument> => {
    const userDoc = await this.findOrCreate(user);
    const newOrigins = _.uniqBy([...userDoc.origins, ...user.origins], origin => origin.name);
    const hasNewOrigins = userDoc.origins.length !== newOrigins.length;

    if (hasNewOrigins) {
      userDoc.origins = newOrigins;
      await userDoc.save();
    }

    return userDoc;
  }

  createMany = async (users: User[]): Promise<UserDocument[]> => {
    const uniqUsers = _.uniqBy(users, user => user.name);
    return await Promise.all(uniqUsers.map(user => this.findOrUpsert(user)));
  }
}

export const userQueries = new UserQueries();
