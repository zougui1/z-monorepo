import fs from 'fs-extra';

export async function waitEndOfStream(filePath: string): Promise<void>;
export async function waitEndOfStream(stream: fs.ReadStream): Promise<void>;
export async function waitEndOfStream(filePathOrStream: string | fs.ReadStream): Promise<void> {
  const readStream = typeof filePathOrStream === 'string'
    ? fs.createReadStream(filePathOrStream)
    : filePathOrStream;

  const promisedEndOfStream = new Promise<void>((resolve, reject) => {
    readStream.once('end', () => {
      resolve();
    });
    readStream.once('error', error => {
      reject(error);
    });
  });

  await promisedEndOfStream.finally(() => readStream.removeAllListeners());
}
