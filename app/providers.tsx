'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f7a8c'
    },
    secondary: {
      main: '#bfdbf7'
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});

export function AppProviders({ children }: { children: ReactNode }) {
  const muiTheme = useMemo(() => theme, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
