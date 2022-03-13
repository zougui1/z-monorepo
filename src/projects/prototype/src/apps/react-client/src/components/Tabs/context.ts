import { PayloadAction } from '@reduxjs/toolkit';
import type { TabProps, BoxTypeMap } from '@mui/material';
import type { OverrideProps } from '@mui/material/OverridableComponent';

//import { createSliceContext } from '@zougui/common.react-utils';
import { createSliceContext } from './src';

export interface TabData {
  id: string;
  titleProps: TabProps;
  panelProps: OverrideProps<BoxTypeMap<{}, 'div'>, 'div'>;
  defaultActive?: boolean;
  allyProps: {
    tabId: string;
    panelId: string;
  };
}

export interface TabsState {
  activeTabId: string,
  tabs: Record<string, TabData>;
}

export const initialState: TabsState = {
  activeTabId: '',
  tabs: {},
};

export const sliceContext = createSliceContext({
  name: 'TabsContext',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      if (state.tabs[id]) {
        console.warn(`A tab with id "${id}" already exists.`);
        return;
      }

      state.tabs[id] = {
        id,
        allyProps: {
          tabId: `${id}-title`,
          panelId: `${id}-panel`,
        },
      } as any;
    },

    removeTab: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.tabs[id];
    },

    updateTab: (state, action: PayloadAction<Omit<TabData, 'allyProps'>>) => {
      const { id } = action.payload;
      const tab = state.tabs[id];

      if (!tab) {
        return;
      }

      state.tabs[id] = {
        ...tab,
        ...action.payload,
      } as any;
    },

    activateTab: (state, action: PayloadAction<{ id: string; }>) => {
      state.activeTabId = action.payload.id;
    },
  },
});

export const {
  useSelector: useTabsSelector,
  useActions: useTabsActions,
  Provider: TabsProvider,
} = sliceContext;

export const tabsActions = sliceContext.slice.actions;
