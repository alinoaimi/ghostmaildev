import { SMTP_CONFIG } from '@/lib/config';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';

export const metadata = {
  title: 'SMTP Info • GhostMailDev'
};

export default function InfoPage() {
  const config = SMTP_CONFIG;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        SMTP Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use the following settings in your email client or automated tests to send messages into GhostMailDev. All emails stay
        on your local machine and are visible in the inbox.
      </Typography>
      <Card>
        <CardHeader title="Connection Details" subheader="Share these with any local SMTP client." />
        <CardContent>
          <List>
            <ListItem>
              <ListItemText primary="Host" secondary={`${config.HOST}`.trim()} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Port" secondary={config.PORT} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Domain" secondary={config.DOMAIN} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Username" secondary={config.USERNAME} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Password" secondary={config.PASSWORD} />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            GhostMailDev listens on all interfaces by default (0.0.0.0). When running inside Docker, the SMTP server is exposed
            on the container port {config.PORT}.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
