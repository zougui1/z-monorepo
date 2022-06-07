import { Container, Paper, Box } from '@mui/material';

import { styles } from './AuthLayout.styles';

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm" sx={styles.container}>
        <Paper elevation={3} sx={styles.paper}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}

export interface AuthLayoutProps {
  children?: React.ReactNode;
}
