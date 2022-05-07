import mongoose from 'mongoose';

import { connect } from './connect';

describe('connect()', () => {
  // reset so that the original function is not called
  const spyConnect = jest.spyOn(mongoose, 'connect').mockReset();

  afterEach(() => {
    spyConnect.mockReset();
  });

  afterAll(() => {
    spyConnect.mockRestore();
  });

  describe('when called without custom host information', () => {
    it('should connect to the default host with default port on the database "dbName" with the node env as suffix', async () => {
      const dbName = 'my-db';
      const expectedUri = `mongodb://localhost:27017/${dbName}_test`;
      const expectedMongoOptions = {};
      await connect({ dbName });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });

    it('should connect to the default host with default port on the database "dbName" without suffix', async () => {
      const dbName = 'my-db';
      const envSuffix = false;
      const expectedUri = `mongodb://localhost:27017/${dbName}`;
      const expectedMongoOptions = {};
      await connect({ dbName, envSuffix });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });
  });

  describe('when called with credentials', () => {
    it('should connect without credentials when only the username is specified', async () => {
      const dbName = 'my-db';
      const username = 'Zougui';
      const expectedUri = `mongodb://localhost:27017/${dbName}_test`;
      const expectedMongoOptions = {};
      await connect({ dbName, username });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });

    it('should connect without credentials when only the password is specified', async () => {
      const dbName = 'my-db';
      const password = 'some_password';
      const expectedUri = `mongodb://localhost:27017/${dbName}_test`;
      const expectedMongoOptions = {};
      await connect({ dbName, password });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });

    it('should connect with credentials when both the username and password are specified', async () => {
      const dbName = 'my-db';
      const username = 'Zougui';
      const password = 'some_password';
      const expectedUri = `mongodb://localhost:27017/${dbName}_test`;
      const expectedMongoOptions = {
        user: username,
        pass: password,
      };
      await connect({ dbName, username, password });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });
  });

  describe('when called with custom host information', () => {
    it('should connect to the specified host, port and database', async () => {
      const dbName = 'my-db';
      const host = 'database.zougui.com';
      const port = 27069;
      const expectedUri = `mongodb://${host}:${port}/${dbName}_test`;
      const expectedMongoOptions = {};
      await connect({ dbName, host, port });

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });
  });

  describe('when called with custom options', () => {
    it('should connect with the specified options', async () => {
      const dbName = 'my-db';
      const expectedUri = `mongodb://localhost:27017/${dbName}_test`;
      const options: mongoose.ConnectOptions = {
        authMechanism: 'MONGODB-X509',
      };
      const expectedMongoOptions = {...options};
      await connect({ dbName }, options);

      expect(spyConnect).toBeCalledTimes(1);
      expect(spyConnect).toBeCalledWith(expectedUri, expectedMongoOptions);
    });
  });
});
