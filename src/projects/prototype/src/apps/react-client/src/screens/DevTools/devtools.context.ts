import { PayloadAction } from '@reduxjs/toolkit';
import { QueryKey } from 'react-query';

import { createSliceContext } from '@zougui/common.react-utils';

export interface TabEntry {
  id: number;
  data: QueryKey;
}

export interface TabData {
  id: number;
  entries: TabEntry[];
}

export interface DevToolTab {
  name: string;
  Component: ({ data }: { data: any }) => JSX.Element;
  data: TabData;
}

export interface DevToolsState {
  tabs: Record<string, DevToolTab>;
}

const initialState: DevToolsState = {
  tabs: {},
};

const context = createSliceContext({
  name: 'DevToolsContext',
  initialState,
  reducers: {
    registerTab: (state, action: PayloadAction<RegisterTabOptions>) => {
      state.tabs[action.payload.name] = {
        ...action.payload,
        data: {
          id: 0,
          entries: [],
        },
      };
    },
    removeTab: (state, action: PayloadAction<{ name: string; }>) => {
      delete state.tabs[action.payload.name];
    },
    pushEntry: (state, action: PayloadAction<{ name: string; entry: QueryKey; }>) => {
      const { name, entry } = action.payload;
      const tab = state.tabs[name];

      if (!tab) return;

      tab.data.entries.push({
        data: entry as any,
        id: tab.data.id++,
      });
    },
  },
});

export const {
  useSelector: useDevToolsSelector,
  useActions: useDevToolsActions,
  Provider: DevToolsProvider,
} = context;

export type RegisterTabOptions = {
  name: string;
  Component: ({ data }: { data: any }) => JSX.Element;
}
