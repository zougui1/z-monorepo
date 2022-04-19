import StackTracey from 'stacktracey';
import { nanoid } from 'nanoid';

import env from '@zougui/common.env/browser';

import { ActionStackFrame } from '../types';

const surroundingLines = 3;
const reFunctioNameCharacters = /[a-z_]/i;
const reSubPackage = new RegExp(`/node_modules/${env.SUB_PACKAGES_NAMESPACE}/`);

export const cleanCalleeName = (name: string): string => {
  if (!name.includes('/')) {
    return name;
  }

  const nameParts = name
    .split('/')
    .filter(name => reFunctioNameCharacters.test(name));

  return nameParts[nameParts.length - 1] || name;
}


export const getStackFrames = async (error: Error | string): Promise<StackFrameGroup[]> => {
  const stack = await new StackTracey(error).withSourcesAsync();
  const stackFrames = stack.items
    .map(cleanStackFrame)
    .map(getFrameCode)
    .filter((frame): frame is ActionStackFrame => !!frame.code);

  const groupedFrames = groupFrames(stackFrames);

  return groupedFrames;
}

const cleanStackFrame = (frame: StackTracey.Entry): Omit<ActionStackFrame, 'code'> => {
  return {
    ...frame,
    id: nanoid(),
    callee: cleanCalleeName(frame.callee),
    calleeShort: cleanCalleeName(frame.calleeShort),
  };
}

const getFrameCode = (frame: Omit<ActionStackFrame, 'code'>): Omit<ActionStackFrame, 'code'> & Partial<Pick<ActionStackFrame, 'code'>> => {
  if (!frame.sourceFile || typeof frame.line !== 'number') {
    return frame;
  }

  const { lines } = frame.sourceFile;

  const frameLineIndex = frame.line - 1;
  const codeStart = Math.max(frameLineIndex - surroundingLines, 0);
  // '+ 1' because we want to include the ending line
  // the function 'slice' excludes it otherwise
  const codeEnd = Math.min(frameLineIndex + surroundingLines + 1, lines.length);
  const codeLines = lines.slice(codeStart, codeEnd);

  return {
    ...frame,
    code: {
      startLineNumber: codeStart + 1,
      endLineNumber: codeEnd - 1,
      currentLineNumber: frame.line,
      lines: codeLines,
    },
  };
}

const getFrameType = (frame: ActionStackFrame): string => {
  if(reSubPackage.test(frame.file)) {
    return 'app';
  }

  if(frame.file.includes('/node_modules/')) {
    return 'node_modules';
  }

  if (frame.file.includes('/webpack/') || frame.fileRelative.startsWith('static/js/')) {
    return 'webpack/bundle';
  }

  return 'app';
}

const groupFrames = (frames: ActionStackFrame[]): StackFrameGroup[] => {
  const groups: StackFrameGroup[] = [];
  let currentType = '';

  for (const frame of frames) {
    const frameType = getFrameType(frame);

    if (currentType === frameType) {
      groups[groups.length - 1]?.frames.push(frame);
      continue;
    }

    currentType = frameType;
    groups.push({
      id: nanoid(),
      type: currentType,
      frames: [frame],
    });
  }

  return groups;
}

export type StackFrameGroup = {
  id: string;
  type: string;
  frames: ActionStackFrame[];
}

export type GroupedStackFrames = {
  app: ActionStackFrame[];
  nodeModules: ActionStackFrame[];
}
