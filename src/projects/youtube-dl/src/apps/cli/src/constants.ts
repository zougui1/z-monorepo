import path from 'node:path';

import env from '@zougui/common.env/node';

export const DOWNLOAD_CONFIG_FILE = path.join(env.APP_WORKSPACE, 'youtube-dl.config.txt');
export const DOWNLOAD_RESULTS_FILE = path.join(env.APP_WORKSPACE, 'download-results.json');
export const MUSIC_OUTPUT = '/mnt/Manjaro_Data/zougui/Audio/Downloads/%(title)s.%(ext)s';
