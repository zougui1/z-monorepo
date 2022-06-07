import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClientProvider } from 'react-query';

import { Router } from './Router';
import { queryClient } from './queryClient';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
