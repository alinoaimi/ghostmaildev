import InboxView from '@/components/InboxView';
import { SMTP_CONFIG } from '@/lib/config';
import { Box, Typography } from '@mui/material';

export default function HomePage() {
  const domain = SMTP_CONFIG.DOMAIN;

  return (
    <Box sx={{ height: '100%' }}>
      <InboxView />
    </Box>
  );
}
