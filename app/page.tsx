import InboxView from '@/components/InboxView';
import { SMTP_CONFIG } from '@/lib/config';
import { Box, Typography } from '@mui/material';

export default function HomePage() {
  const domain = SMTP_CONFIG.DOMAIN;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Inbox
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor every email delivered to <strong>@{domain}</strong>. Messages remain on this server only.
      </Typography>
      <InboxView />
    </Box>
  );
}
