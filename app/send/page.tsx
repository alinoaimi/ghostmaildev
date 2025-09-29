import SendEmailForm from '@/components/SendEmailForm';
import { Box, Typography } from '@mui/material';

export const metadata = {
  title: 'Compose • GhostMailDev'
};

export default function SendPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Compose an Email
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use this form to send messages through the local SMTP server. Deliveries are stored locally and appear instantly in the
        inbox.
      </Typography>
      <SendEmailForm />
    </Box>
  );
}
