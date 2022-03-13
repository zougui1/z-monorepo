import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const clientSlice = createSlice({
  name: 'client',
  initialState: {
    language: 'en-US',
    settings: {
      feature: 'disabled'
    } as any,
    names: ['some', 'name']
  },
  reducers: {
    changeLanguage: (state, action: PayloadAction<{ language: string }>) => {
      state.language = action.payload.language;
    },
    removeSetting: (state, action: PayloadAction<string>) => {
      state.settings[action.payload] = undefined;
    },
    addSeting: (state, action: PayloadAction<any>) => {
      state.settings[action.payload.name] = action.payload;
    }
  },
});

export const store = configureStore({
  reducer: {
    client: clientSlice.reducer,
  },
});

store.dispatch(clientSlice.actions.changeLanguage({
  language: 'fr-FR'
}));

setTimeout(() => {
  store.dispatch(clientSlice.actions.changeLanguage({
    language: 'en-US'
  }));
}, 100);

setTimeout(() => {
  store.dispatch(clientSlice.actions.removeSetting('feature'));
}, 100);

setTimeout(() => {
  store.dispatch(clientSlice.actions.addSeting({
    name: 'new feature',
    lorem: 'lorem',
    ipsum: 'ipsum',
    some: 'prop',
  }));
}, 100);
