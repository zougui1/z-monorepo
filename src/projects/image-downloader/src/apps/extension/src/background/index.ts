const runBackgroundScript = async () => {
  //const tabs = await browser.tabs.query({});
  //console.log('tabs', tabs);

  //await uploadImage2();

  browser.runtime.onMessage.addListener(message => {
    const event = JSON.parse(message);
    const action = (actions as Record<string, any>)[event.type];

    if (!action) {
      console.log(`No action registered for "${event.type}"`);
      return;
    }

    action(event.payload);
  });
}

const actions = {
  'FA:submission': async ({ submission }: any) => {
    await uploadSubmission(submission);
  },
};

runBackgroundScript()
  .catch(error => {
    console.error('Background script error:', error);
  });

async function uploadSubmission(submission: any) {
  await fetch('http://localhost:3000/api/v1/media', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(submission)
  })
}

async function uploadImage2() {
  const siranor = {
    name: 'Siranor',
    profileUrls: ['https://furaffinity.net/user/siranor', 'https://siranor.sofurry.com/'],
  };

  const dradmon = {
    name: 'Dradmon',
    profileUrls: ['https://furaffinity.net/user/dradmon'],
  };

  const body = {
    type: 'image',
    fileName: 'some-dragon',
    extension: 'jpg',
    urls: ['https://furaffinity.net/view/1215415', 'https://e621.net/posts/5415184'],
    hash: 'some hash',
    tags: ['dragon', 'SFW'],
    authors: [siranor, dradmon],
    title: 'Cuddling dragons',
    description: 'Some dragons cuddling.',
    variants: [
      {
        type: 'image',
        fileName: 'some-dragon (NSFW)',
        title: 'Naughty dragons',
        description: 'Some dragons doing what dragons do best.',
        extension: 'jpg',
        hash: 'some hash',
        urls: ['https://furaffinity.net/view/1215416', 'https://e621.net/posts/5415185'],
        tags: ['dragon', 'NSFW'],
        authors: [siranor, dradmon],
      },
      {
        type: 'image',
        fileName: 'some-dragon (cum)',
        title: 'Messy dragons',
        description: 'Some dragons just did what dragons do best.',
        extension: 'jpg',
        hash: 'some hash',
        urls: ['https://furaffinity.net/view/1215417', 'https://e621.net/posts/5415186'],
        tags: ['dragon', 'NSFW', 'cum'],
        authors: [siranor, dradmon],
      }
    ],
  };

  // setup the HTTP request to get ddg results
  /*let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    console.log('onload');
  };

  xhr.onerror = function (e) {
    console.log('An error occurred', e);
  }

  // open and send the request.
  xhr.open('POST', 'http://localhost:3000/api/v1/media', true);
  xhr.responseType = 'json';
  xhr.send(JSON.stringify(body));*/

  await fetch('http://localhost:3000/api/v1/media', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}
