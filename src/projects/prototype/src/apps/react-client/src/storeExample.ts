import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const clientSlice = createSlice({
  name: 'client',
  initialState: {
    language: 'en-US',
    settings: {
      feature: 'disabled'
    },
    names: ['some', 'name']
  },
  reducers: {
    changeLanguage: (state, action: PayloadAction<{ language: string }>) => {
      state.language = action.payload.language;
    },
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
