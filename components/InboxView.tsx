'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

export interface InboxEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
  date: string;
  raw: string;
}

export default function InboxView() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedEmail = useMemo(() => emails.find((email) => email.id === selectedId) ?? null, [emails, selectedId]);

  const loadEmails = useCallback(async () => {
    try {
      const response = await fetch('/api/emails');
      if (!response.ok) {
        throw new Error('Unable to fetch emails');
      }
      const payload = (await response.json()) as InboxEmail[];
      setEmails(payload);
      if (!selectedId && payload.length > 0) {
        setSelectedId(payload[0].id);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load emails. Ensure the SMTP server is running.');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadEmails();
    const interval = setInterval(loadEmails, 5000);
    return () => clearInterval(interval);
  }, [loadEmails]);

  const handleRefresh = () => {
    setLoading(true);
    loadEmails();
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/emails', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to clear inbox');
      }
      setEmails([]);
      setSelectedId(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to clear inbox.');
    } finally {
      setLoading(false);
    }
  };

  const renderDetails = () => {
    if (loading && emails.length === 0) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading inbox…
          </Typography>
        </Stack>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (!selectedEmail) {
      return (
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <Typography variant="h6">Your inbox is empty.</Typography>
          <Typography variant="body2" color="text.secondary">
            Send an email to any address ending with @ghostmail.local to see it appear here.
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedEmail.subject}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(selectedEmail.date).toLocaleString()}
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            From
          </Typography>
          <Typography variant="body1">{selectedEmail.from}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            To
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedEmail.to.map((recipient) => (
              <Chip key={recipient} label={recipient} color="secondary" variant="outlined" />
            ))}
          </Stack>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Message
          </Typography>
          {selectedEmail.html ? (
            <Box
              sx={{
                p: 2,
                backgroundColor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '& *': { maxWidth: '100%' }
              }}
              dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
            />
          ) : (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              {selectedEmail.text || '(No message body)'}
            </Typography>
          )}
        </Box>
      </Stack>
    );
  };

  return (
    <Stack direction={isSmall ? 'column-reverse' : 'row'} spacing={3}>
      <Box sx={{ flexBasis: isSmall ? 'auto' : '32%', flexGrow: isSmall ? 0 : 0, width: isSmall ? '100%' : '32%' }}>
        <Paper elevation={2} sx={{ height: isSmall ? 'auto' : 'calc(100vh - 220px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            <Typography variant="h6">Inbox</Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={handleRefresh} disabled={loading}>
                Refresh
              </Button>
              <Button size="small" color="error" variant="outlined" onClick={handleClear} disabled={loading}>
                Clear
              </Button>
            </Stack>
          </Stack>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {emails.length === 0 && !loading ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No emails yet.
              </Typography>
            ) : (
              <List disablePadding>
                {emails.map((email) => (
                  <ListItemButton
                    key={email.id}
                    selected={selectedId === email.id}
                    onClick={() => setSelectedId(email.id)}
                    alignItems="flex-start"
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                          {email.subject}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {email.from}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {new Date(email.date).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Paper elevation={2} sx={{ p: 3, minHeight: '60vh' }}>
          {renderDetails()}
        </Paper>
      </Box>
    </Stack>
  );
}
