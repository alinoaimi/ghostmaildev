'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function SendEmailForm() {
  const [from, setFrom] = useState('tester@ghostmail.local');
  const [to, setTo] = useState('recipient@ghostmail.local');
  const [subject, setSubject] = useState('Hello from GhostMailDev');
  const [body, setBody] = useState('Hi there! This is a test email delivered by GhostMailDev.');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<ApiResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, text: body })
      });

      const payload = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to send email');
      }
      setFeedback({ success: true, message: payload.message });
    } catch (error) {
      setFeedback({ success: false, message: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ height: '100%', overflowY: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant="h6">Compose Email</Typography>
        <TextField
          label="From"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          helperText="Use any local address (e.g. user@ghostmail.local)."
          required
        />
        <TextField
          label="To"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          helperText="Comma separated list of recipients."
          required
        />
        <TextField label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} required />
        <TextField
          label="Message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          multiline
          minRows={6}
          maxRows={10}
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Email'}
        </Button>
        {feedback && (
          <Alert severity={feedback.success ? 'success' : 'error'}>{feedback.message}</Alert>
        )}
      </Stack>
    </Box>
  );
}
