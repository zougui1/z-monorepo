import { decode, GIF, Frame } from 'imagescript';
import imgHash from 'imghash';
import leven from 'fast-levenshtein';
import fs from 'fs-extra';

//* hash segments test
(async () => {
  // 2.04 seconds
  const animationDuration = 2040;
  const frames = 51;
  const fps = 25;

  const inputAnimationSegments = [
    {
      startAt: 0,
      endAt: 240,
      firstFrame: 0,
      middleFrame: 3,
      endFrame: 6,
      duration: 240,
      firstHash: 'htrhtrhtrthththhtthth',
      middleHash: 'fegirubnehuifruhiefgruhiegfr',
      lastHash: 'grotinrgijojiorgijrgh',
    },
    {
      startAt: 720,
      endAt: 960,
      firstFrame: 18,
      middleFrame: 21,
      endFrame: 24,
      duration: 240,
      firstHash: 'gerhtherterht',
      middleHash: 'gresgeregrhgr',
      lastHash: 'hdthtgrerge',
    },
    {
      startAt: 1200,
      endAt: 1440,
      firstFrame: 30,
      middleFrame: 33,
      endFrame: 36,
      duration: 240,
      firstHash: 'gerhtherterht',
      middleHash: 'gresgeregrhgr',
      lastHash: 'hdthtgrerge',
    },
    {
      startAt: 1680,
      endAt: 1920,
      firstFrame: 42,
      middleFrame: 45,
      endFrame: 48,
      duration: 240,
      firstHash: 'gerhtherterht',
      middleHash: 'gresgeregrhgr',
      lastHash: 'hdthtgrerge',
    },
    {
      startAt: 1800,
      endAt: 2040,
      firstFrame: 45,
      middleFrame: 48,
      endFrame: 51,
      duration: 240,
      firstHash: 'gerhtherterht',
      middleHash: 'gresgeregrhgr',
      lastHash: 'hdthtgrerge',
    },
  ];

  const savedAnimationSegments = inputAnimationSegments;

  const distances: number[] = [];

  for (let i = 0; i < inputAnimationSegments.length; i++) {
    const inputSegment = inputAnimationSegments[i];
    const savedSegment = savedAnimationSegments[i];

    const firstDistance = leven.get(inputSegment.firstHash, savedSegment.firstHash);
    const middleDistance = leven.get(inputSegment.middleHash, savedSegment.middleHash);
    const lastDistance = leven.get(inputSegment.lastHash, savedSegment.lastHash);

    const meanDistance = (firstDistance + middleDistance + lastDistance) / 3;
    distances.push(meanDistance);
  }
})();

//* GIF decoding test
(async () => {
  const file = '/mnt/Manjaro_Data/zougui/Artworks/Dragons/NSFW/4a5accf74b0919f95ec3c48ddef31239.gif';

  const gifData = await fs.readFile(file);
  const gif = await decode(gifData) as GIF;
  const fps = gif.length / (gif.duration / 1000);

  console.log('fps:', fps);
  console.log('frames:', gif.length);
  console.log('GIF duration:', gif.duration);

  const hashes: string[] = [];

  // gif.map would map into a new Gif and not a new array
  for (const frame of gif) {
    // get hash from the raw frames
    const hash = imgHash.hashRaw({
      width: frame.width,
      height: frame.height,
      data: frame.bitmap,
    }, 16);
    hashes.push(hash);
  }
})();
