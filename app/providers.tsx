'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { ThemeModeProvider, useThemeMode } from '../contexts/ThemeContext';

function MuiThemeProvider({ children }: { children: ReactNode }) {
  const { actualTheme } = useThemeMode();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: actualTheme,
      primary: {
        main: '#1f7a8c',
        dark: '#145f6b',
        light: '#4aa6ba'
      },
      secondary: {
        main: '#bfdbf7',
        dark: '#8ba9c4',
        light: '#e0edf9'
      },
      background: {
        default: actualTheme === 'dark' ? '#0a0e1a' : '#f4f6f8',
        paper: actualTheme === 'dark' ? '#1a1f2e' : '#ffffff'
      },
      text: {
        primary: actualTheme === 'dark' ? '#e1e5e9' : '#1f2933',
        secondary: actualTheme === 'dark' ? '#9fb3c8' : '#627d98'
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }
  }), [actualTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeModeProvider>
      <MuiThemeProvider>
        {children}
      </MuiThemeProvider>
    </ThemeModeProvider>
  );
}
