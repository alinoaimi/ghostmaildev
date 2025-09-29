'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

const navItems = [
  { label: 'Inbox', href: '/' },
  { label: 'Compose', href: '/send' },
  { label: 'SMTP Info', href: '/info' }
];

export default function AppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            GhostMailDev
          </Typography>
          <Box>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant={active ? 'contained' : 'text'}
                  sx={{ color: '#fff', marginLeft: 1 }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>{children}</Container>
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="body2">Local testing mail server • Messages stay on this machine</Typography>
      </Box>
    </Box>
  );
}
