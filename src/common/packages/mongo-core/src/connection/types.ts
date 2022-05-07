export interface ConnectOptions {
  host?: string | undefined;
  port?: number | undefined;
  dbName: string;
  username?: string | undefined;
  password?: string | undefined;
  /**
   * @default true
   */
  envSuffix?: boolean | undefined;
}
