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
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
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
  const [selectedRecipient, setSelectedRecipient] = useState<string>('all');

  const selectedEmail = useMemo(() => emails.find((email) => email.id === selectedId) ?? null, [emails, selectedId]);

  // Get unique recipients for filter
  const uniqueRecipients = useMemo(() => {
    const recipients = new Set<string>();
    emails.forEach(email => {
      email.to.forEach(recipient => recipients.add(recipient));
    });
    return Array.from(recipients).sort();
  }, [emails]);

  // Filter emails by selected recipient
  const filteredEmails = useMemo(() => {
    if (selectedRecipient === 'all') {
      return emails;
    }
    return emails.filter(email => email.to.includes(selectedRecipient));
  }, [emails, selectedRecipient]);

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

  // Handle selection when filtering changes
  useEffect(() => {
    if (filteredEmails.length > 0) {
      // If current selection is not in filtered results, select first filtered email
      if (!selectedId || !filteredEmails.find(email => email.id === selectedId)) {
        setSelectedId(filteredEmails[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredEmails, selectedId]);

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
              <Chip 
                key={recipient} 
                label={recipient} 
                color="primary" 
                variant="outlined"
                sx={{
                  color: theme.palette.mode === 'dark' ? 'grey.100' : undefined,
                  borderColor: theme.palette.mode === 'dark' ? 'grey.300' : undefined,
                  '& .MuiChip-label': {
                    color: theme.palette.mode === 'dark' ? 'grey.100' : undefined,
                  }
                }}
              />
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
    <Stack direction={isSmall ? 'column-reverse' : 'row'} spacing={0} sx={{ height: '100%' }}>
      <Box sx={{ flexBasis: isSmall ? 'auto' : '32%', flexGrow: isSmall ? 0 : 0, width: isSmall ? '100%' : '32%' }}>
        <Paper elevation={0} sx={{ height: isSmall ? '300px' : '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 0, borderRight: isSmall ? 'none' : '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, flexShrink: 0 }}>
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
          
          {/* Filter Section */}
          {uniqueRecipients.length > 0 && (
            <div>
              <Divider />
              <Box sx={{ px: 2, pb: 2, pt: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="recipient-filter-label">Filter by recipient</InputLabel>
                <Select
                  labelId="recipient-filter-label"
                  value={selectedRecipient}
                  label="Filter by recipient"
                  onChange={(event) => setSelectedRecipient(event.target.value)}
                >
                  <MenuItem value="all">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">All recipients</Typography>
                      <Chip 
                        label={emails.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </MenuItem>
                  {uniqueRecipients.map((recipient) => {
                    const count = emails.filter(email => email.to.includes(recipient)).length;
                    return (
                      <MenuItem key={recipient} value={recipient}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {recipient}
                          </Typography>
                          <Chip 
                            label={count} 
                            size="small" 
                            color="default" 
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            </div>
          )}
          
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {filteredEmails.length === 0 && !loading ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                {selectedRecipient === 'all' ? 'No emails yet.' : `No emails for ${selectedRecipient}.`}
              </Typography>
            ) : (
              <List disablePadding>
                {filteredEmails.map((email) => (
                  <Box key={email.id}>
                    <ListItemButton
                      selected={selectedId === email.id}
                      onClick={() => setSelectedId(email.id)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderLeft: selectedId === email.id ? '4px solid' : '4px solid transparent',
                        borderLeftColor: selectedId === email.id ? 'primary.main' : 'transparent',
                        backgroundColor: selectedId === email.id ? 'primary.50' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedId === email.id ? 'primary.100' : 'action.hover',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {/* Subject and Date Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: selectedId === email.id ? 700 : 600,
                              color: selectedId === email.id 
                                ? (theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main')
                                : (theme.palette.mode === 'dark' ? 'common.white' : 'text.primary'),
                              fontSize: '0.95rem',
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '75%'
                            }}
                          >
                            {email.subject || '(No subject)'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.disabled',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              flexShrink: 0,
                              ml: 1
                            }}
                          >
                            {new Date(email.date).toLocaleDateString([], { 
                              month: 'short', 
                              day: 'numeric',
                              ...(new Date(email.date).getFullYear() !== new Date().getFullYear() && { year: 'numeric' })
                            })}
                          </Typography>
                        </Box>
                        
                        {/* From and Preview Row */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: selectedId === email.id 
                                ? (theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark')
                                : (theme.palette.mode === 'dark' ? 'grey.300' : 'text.secondary'),
                              fontWeight: 500,
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {email.from}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? 'grey.400' : 'text.disabled',
                              fontSize: '0.8rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: 1.2
                            }}
                          >
                            {email.text?.substring(0, 80) || '(No content)'}
                            {email.text && email.text.length > 80 ? '...' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                    <Divider sx={{ mx: 3, opacity: 0.3 }} />
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Paper elevation={0} sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
            {renderDetails()}
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
}
