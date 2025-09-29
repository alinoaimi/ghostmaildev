import SendEmailForm from '@/components/SendEmailForm';
import { Box, Typography } from '@mui/material';

export const metadata = {
  title: 'Compose • GhostMailDev'
};

export default function SendPage() {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Compose an Email
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use this form to send messages through the local SMTP server. Deliveries are stored locally and appear instantly in the
          inbox.
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <SendEmailForm />
      </Box>
    </Box>
  );
}
