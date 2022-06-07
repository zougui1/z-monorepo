import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import { AuthClientProvider } from '@zougui/auth.react-http/v1';

import { Router } from './Router';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthClientProvider>
        <CssBaseline />
        <Router />
      </AuthClientProvider>
    </ThemeProvider>
  );
}
