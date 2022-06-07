import config from '@zougui/common.config/node';

export const findLatestHashVersion = (): number => {
  const versions = Object
    .keys(config.crypto.hash.node)
    .map(version => Number(version.slice(1)));

  const latestVersion = Math.max(...versions);

  return latestVersion || -1;
}
