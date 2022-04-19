export interface DescriptionTree {
  type: 'root';
  text: string;
  textAlign?: 'left' | 'right' | 'center' | undefined;
  children: DescriptionNode[];
}

export type DescriptionNode = (
  | DescriptionTextNode
  | DescriptionLinkNode
  | DescriptionElementNode
  | DescriptionUnknownNode
);

export interface DescriptionTextNode {
  type: 'text';
  text: string;
}

export interface DescriptionLinkNode {
  type: 'link';
  href: string | undefined;
  text: string;
  src?: string | undefined;
  alt?: string | undefined;
  title?: string | undefined;
}

export interface DescriptionElementNode {
  type: string;
  text: string;
  style?: string | undefined;
  children?: DescriptionNode[] | undefined;
}

export interface DescriptionUnknownNode {
  type: 'unknown';
  text: string;
  tagName: string;
  attributes: Record<string, string>;
}
