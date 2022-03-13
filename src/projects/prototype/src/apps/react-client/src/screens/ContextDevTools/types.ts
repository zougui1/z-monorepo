import type { Entry } from 'stacktracey';

export interface ActionData {
  id: string;
  contextName: string;
  timestamp: number;
  previousState: any;
  nextState: any;
  timings: {
    reducers: number;
    subscribers: number;
    total: number;
  };
  stack?: string;

  data: {
    type: string;
    payload?: any;
  };
}

export interface ActionStackFrame extends Entry {
  id: string;
  code?: CodeInfo;
}

export type CodeInfo = {
  startLineNumber: number;
  endLineNumber: number;
  currentLineNumber: number;
  lines: string[];
}

export type GroupedStackFrames = {
  app: ActionStackFrame[];
  nodeModules: ActionStackFrame[];
}
