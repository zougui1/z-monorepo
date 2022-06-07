import { stripHtml } from 'string-strip-html';
import { JSDOM } from 'jsdom';

import { prefixWith } from '@zougui/common.string-utils';
import { secureHttpProtocol, isRelativeUrl } from '@zougui/common.url-utils';

import type {
  DescriptionTree,
  DescriptionNode,
  DescriptionElementNode,
  DescriptionLinkNode,
} from './description.types';

const isTextNode = (node: ChildNode): boolean => {
  return node.nodeName.toLowerCase() === '#text';
}

const areChildNodesText = (node: ChildNode): boolean => {
  return Array.from(node.childNodes).every((node) => isTextNode(node));
}

const getElementStyle = (element: Element): string | undefined => {
  return element.attributes.getNamedItem('style')?.value;
}

const getNodeName = (node: ChildNode): string => {
  return node.nodeName.toLowerCase();
}

const getElementNode = (node: ChildNode, element: Element): DescriptionElementNode => {
  const nodeName = getNodeName(node);
  const text = node.textContent || '';
  const style = getElementStyle(element);
  const isTextOnly = areChildNodesText(node);

  const baseNode = {
    type: nodeName,
    text,
    style,
  };

  if (isTextOnly) {
    return baseNode;
  }

  return {
    ...baseNode,
    children: getDescriptionNodes(element),
  };
}

const reTextAlign = /(left)|(right)|(center)/;
const defaultTextAlign = 'left';

const getDescriptionTree = (descriptionElement: Element): DescriptionTree => {
  const className = descriptionElement.attributes.getNamedItem('class')?.value;
  const textAlignMatches = className?.match(reTextAlign);
  const textAlign = (textAlignMatches?.[0] || defaultTextAlign) as 'left' | 'right' | 'center';

  return {
    type: 'root',
    text: descriptionElement.textContent || '',
    textAlign,
    children: getDescriptionNodes(descriptionElement),
  };
}

const getDescriptionNodes = (element: Element): DescriptionNode[] => {
  const descriptionNodes: DescriptionNode[] = [];

  const childNodes = Array.from(element?.childNodes || []);
  const children = Array.from(element?.children || []);
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
      case 'span':
      case 'strong':
        elementIndex++;
        descriptionNodes.push(getElementNode(node, childElement));
        break;
      case 'a': {
        elementIndex++;
        if (!childElement) {
          break;
        }

        const img = Array.from(childElement.children).find((node) => {
          return node.nodeName.toLowerCase() === 'img';
        });
        const href = childElement.attributes.getNamedItem('href')?.value;
        let fullHref: string | undefined;

        if (href) {
          fullHref = isRelativeUrl(href)
            ? prefixWith(href, 'https://furaffinity.net')
            : secureHttpProtocol(href);
        }

        const linkElement: DescriptionLinkNode = {
          type: 'link',
          href: fullHref,
          text: node.textContent || '',
        };

        if (img) {
          const src = img.attributes.getNamedItem('src')?.value;
          const alt = img.attributes.getNamedItem('alt')?.value;
          const title = img.attributes.getNamedItem('title')?.value;

          descriptionNodes.push({
            ...linkElement,
            src: src ? secureHttpProtocol(src) : src,
            alt,
            title,
          });
        } else {
          descriptionNodes.push(linkElement);
        }

        break;
      }

      default:
        elementIndex++;
        const attributes: Record<string, string> = {};

        for (const attribute of childElement?.attributes || []) {
          attributes[attribute.name] = attribute.value;
        }

        descriptionNodes.push({
          type: 'unknown',
          text: node.textContent || '',
          tagName: nodeName,
          attributes,
          children: childElement && getDescriptionNodes(childElement),
        });
        break;
    }
  }

  if (descriptionNodes[0]) {
    descriptionNodes[0].text = descriptionNodes[0].text
      .replace(/^\n/, '')
      .trimLeft();

    // if there is no text then this node is useless
    if (!descriptionNodes[0].text) {
      descriptionNodes.shift();
    }
  }

  return descriptionNodes;
}

export const parseDescription = (description: string): DescriptionTree => {
  const strippedHtml = stripHtml(description, {
    onlyStripTags: ['script', 'style', 'xml'],
    stripTogetherWithTheirContents: ['script', 'style', 'xml'],
  });
  const { window } = new JSDOM(`<!DOCTYPE html>${strippedHtml.result}`);
  const { document } = window;
  const rootElement = document.querySelector('body')?.children[0];

  if (rootElement) {
    return getDescriptionTree(rootElement);
  }

  const emptyTree: DescriptionTree = {
    type: 'root',
    text: '',
    children: [],
  };

  return emptyTree;
}
