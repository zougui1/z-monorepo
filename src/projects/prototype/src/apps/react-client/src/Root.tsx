import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
//import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, createTheme } from '@mui/material';

import { Provider } from 'react-redux';
import { store } from './storeExample';

import { App } from './App';
import { queryClient } from './queryClient';

const ReactQueryDevtools = React.Fragment;

export const Root = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    }
  });

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <App />
              <ReactQueryDevtools  />
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
