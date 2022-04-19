const findSubmissionPage = (): HTMLElement | null => {
  return document.getElementById('submission_page');
}

const findDownloadButton = (): Element | undefined => {
  const container = findSubmissionPage();

  if (!container) {
    return;
  }

  const linkButtons = container.querySelectorAll('a.button');
  const downloadLink = Array
    .from(linkButtons)
    .find(link => link.textContent?.toLowerCase() === 'download');

  return downloadLink;
}

const getSubmissionUrl = () => {
  const downloadButton = findDownloadButton();

  if (!downloadButton) {
    return;
  }

  const { origin, pathname } = window.location;
  const url = origin + pathname;

  const downloadUrl = downloadButton.attributes.getNamedItem('href')?.value;
  const cleanDownloadUrl = downloadUrl && !downloadUrl.startsWith('http')
    ? encodeURI(`https:${downloadUrl}`)
    : downloadUrl;

  return {
    url,
    downloadUrl: cleanDownloadUrl,
  };
}

const getSubmissionSidebar = () => {
  return document.querySelector('.submission-sidebar');
}

const getSubmissionTags = () => {
  const tags = getSubmissionSidebar()
    ?.querySelector('.tags-row')
    ?.getElementsByClassName('tags');

  if (!tags) {
    return [];
  }

  const tagsText = Array.from(tags).map(tag => tag.textContent).filter(Boolean) as string[];

  return tagsText;
}

const getSubmissionInfo = () => {
  const infoSection = getSubmissionSidebar()?.querySelector('.info');

  if (!infoSection) {
    return {};
  }

  const [categoryRow, speciesRow, genderRow] = Array.from(infoSection.children);

  const submissionType = categoryRow?.querySelector('.category-name')?.textContent;
  const category = categoryRow?.querySelector('.type-name')?.textContent;
  const species = speciesRow?.querySelector('span')?.textContent;
  const gender = genderRow?.querySelector('span')?.textContent;

  return {
    submissionType,
    category,
    species: [species],
    genders: [gender],
  };
}

enum Ratings {
  general = 'SFW',
  mature = 'NSFW',
  adult = 'NSFW',
}

const getSubmissionRating = () => {
  const ratingElement = getSubmissionSidebar()
    ?.querySelector('.rating')
    ?.querySelector('.rating-box');

  const rating = ratingElement?.textContent?.toLowerCase().trim();

  return (Ratings as Record<string, Ratings | undefined>)[rating || ''];
}

const getSubmissionDescriptors = () => {
  const page = findSubmissionPage();

  if (!page) {
    return {};
  }

  const title = page.querySelector('.submission-title')?.textContent?.replace(/^\n/, '').trim();
  const descriptionElement = page.querySelector('.submission-description');
  const description = descriptionElement?.textContent?.replace(/^\n/, '').trimLeft() || '';

  const descriptionNodes = [];

  const childNodes = Array.from(descriptionElement?.childNodes || []);
  const children = Array.from(descriptionElement?.children || []);
  let elementIndex = 0;

  for (const node of childNodes) {
    const childElement = children[elementIndex];
    const nodeName = node.nodeName.toLowerCase();

    switch (nodeName) {
      case '#text':
        descriptionNodes.push({
          type: 'text',
          text: node.textContent || '',
        });
        break;
      case 'br':
        elementIndex++;
        descriptionNodes.push({
          type: 'text',
          text: '\n',
        });
        break;
      case 'a': {
        elementIndex++;
        if (!childElement) {
          break;
        }

        const img = Array.from(childElement.children).find(node => node.nodeName.toLowerCase() === 'img');
        const href = childElement.attributes.getNamedItem('href')?.value;

        const linkElement = {
          type: 'link',
          href,
          text: node.textContent || '',
        };

        if (img) {
          const src = img.attributes.getNamedItem('src')?.value;
          const alt = img.attributes.getNamedItem('alt')?.value;
          const title = img.attributes.getNamedItem('title')?.value;

          descriptionNodes.push({
            ...linkElement,
            src,
            alt,
            title,
          });
        } else {
          console.log('link does not have img');
          descriptionNodes.push(linkElement);
        }

        break;
      }

      default:
        descriptionNodes.push({ type: 'unknown', text: node.textContent || '' });
        console.log('unhandled node type:', nodeName);
        break;
    }
  }

  if (descriptionNodes[0]) {
    descriptionNodes[0].text = descriptionNodes[0].text.replace(/^\n/, '').trimLeft();
  }

  return {
    title,
    description,
    descriptionNodes,
  };
}

const getAuthor = () => {
  const link = findSubmissionPage()
    ?.querySelector('.submission-id-sub-container')
    ?.querySelector('a');

  if (!link) {
    return {};
  }

  const profileUrl = link.href || '';
  const name = link.textContent || '';

  return {
    name,
    profileUrl,
  };
}

const getPublishDate = () => {
  const dateElement = findSubmissionPage()
    ?.querySelector('.submission-id-sub-container')
    ?.querySelector('.popup_date');

  const dateString = dateElement?.attributes.getNamedItem('title')?.value;

  if (!dateString) {
    return;
  }

  return new Date(dateString);
}

const getSubmissionData = () => {
  const tags = getSubmissionTags();
  const submissionUrl = getSubmissionUrl();
  const info = getSubmissionInfo();
  const descriptors = getSubmissionDescriptors();
  const author = getAuthor();
  const publishedAt = getPublishDate();
  const rating = getSubmissionRating();

  return {
    ...info,
    ...submissionUrl,
    ...descriptors,
    publishedAt,
    author,
    tags,
    rating,
  };
}

const runContentScript = async () => {
  const submission = getSubmissionData();

  if (!submission) {
    console.log('Submission URL not found.');
    return;
  }

  // either send to the background of the extension (unecessary)
  // or POST into a server which will process it
  browser.runtime.sendMessage(JSON.stringify({
    type: 'FA:submission',
    payload: {
      submission
    },
  }));
}

runContentScript()
  .catch(error => {
    console.error('Content script error:', error);
  });
