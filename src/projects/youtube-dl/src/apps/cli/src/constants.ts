import path from 'node:path';

import env from '@zougui/common.env/node';

export const DOWNLOAD_CONFIG_FILE = path.join(env.APP_WORKSPACE, 'youtube-dl.config.txt');
export const DOWNLOAD_RESULTS_FILE = path.join(env.APP_WORKSPACE, 'download-results.json');
const OUTPUT_DIR = env.get('OUTPUT_DIR').required().asString();
export const MUSIC_FILENAME = env.get('MUSIC_FILENAME').required().asString();
export const MUSIC_OUTPUT = path.join(OUTPUT_DIR, MUSIC_FILENAME);
