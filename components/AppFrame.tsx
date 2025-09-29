'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  Typography,
  Chip,
  Avatar,
  Stack,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Inbox as InboxIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Inbox', href: '/', icon: InboxIcon },
  { label: 'Compose', href: '/send', icon: EditIcon },
  { label: 'SMTP Info', href: '/info', icon: InfoIcon }
];

export default function AppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isInboxPage = pathname === '/';
  const theme = useTheme();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          py: 0.5,
          minHeight: '56px !important'
        }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 32,
                height: 32,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <EmailIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Link href="/" aria-label="Home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '-0.3px',
                    lineHeight: 1.1,
                    fontSize: '1.1rem'
                  }}
                >
                  GhostMailDev
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                  <CircleIcon sx={{ fontSize: 6, color: '#4ade80' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  >
                    Local SMTP Server
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={1} alignItems="center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  startIcon={<Icon fontSize="small" />}
                  sx={{
                    color: active ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.75,
                    borderRadius: '8px',
                    backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: '1px solid transparent',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </AppBar>
      {isInboxPage ? (
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>
      ) : (
        <Container 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            py: 4, 
            px: 3,
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          {children}
        </Container>
      )}
      <Box 
        component="footer" 
        sx={{ 
          py: 1.5, 
          px: 3,
          textAlign: 'center', 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            opacity: 0.9
          }}
        >
          Local testing mail server • Messages stay on this machine
        </Typography>
      </Box>
    </Box>
  );
}
