import path from 'node:path';

import sharp from 'sharp';
import { decode, GIF, Frame } from 'imagescrip';
import imgHash from 'imghash';
import leven from 'fast-levenshtein';

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
  const gifHashFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/gif-hash-result.json';
  //const file = '/mnt/Manjaro_Data/zougui/Artworks/Dragons/NSFW/gifs/ZtreN7Pq.gif'

  const gifData = await fs.readFile(file);
  const gif = await decode(gifData) as GIF;
  const fps = gif.length / (gif.duration / 1000);

  console.log('fps:', fps);
  console.log('frames:', gif.length);
  console.log('GIF duration:', gif.duration);

  const hashes: string[] = [];

  for (const frame of gif) {
    const hash = imgHash.hashRaw({
      width: frame.width,
      height: frame.height,
      data: frame.bitmap,
    }, 16);
    hashes.push(hash);
    //frame.encodeJPEG()
    //console.log('frame', frame.width, frame.height, frame)
  }

  const frameMatchResults = hashes.map((hash, index) => {
    const frame = {
      hash,
      index,
    };
    const otherHashes = hashes
      .map((hash, index) => ({ hash, index }))
      .filter(otherFrame => frame.index !== otherFrame.index);

    return otherHashes.map(otherFrame => {
      return {
        matchedFrames: [frame, otherFrame],
        distance: leven.get(hash, otherFrame.hash)
      };
    });
  }).flat();

  const result = {
    frameMatchResults,
    closeDistances: frameMatchResults.filter(frame => frame.distance <= 5),
    duplicates: frameMatchResults.filter(f => f.distance === 0),
  };

  const dir = '/mnt/Manjaro_Data/zougui/Artworks/Dragons/NSFW/duplicates';

  for (const duplicate of result.duplicates) {
    const [frameIndexA, frameIndexB] = duplicate.matchedFrames.map(f => f.index);
    const frameA = gif[frameIndexA] as Frame;
    const frameB = gif[frameIndexB] as Frame;

    const duplicateDir = path.join(dir, frameIndexA.toString());
    await fs.ensureDir(duplicateDir);

    const frameFileA = path.join(duplicateDir, `${frameIndexA}.jpg`);
    const frameFileB = path.join(duplicateDir, `${frameIndexB}.jpg`);

    const jpegA = await frameA.encodeJPEG();
    const jpegB = await frameB.encodeJPEG();

    await fs.writeFile(frameFileA, jpegA);
    await fs.writeFile(frameFileB, jpegB);
  }

  await fs.writeJson(gifHashFile, result, { spaces: 2 });

  const metadata = await sharp(file).metadata();
  console.log(metadata)
})();
