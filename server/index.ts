import http from 'http';
import { parse } from 'url';
import next from 'next';
import { SMTPServer, SMTPServerAuthentication, SMTPServerSession } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { randomUUID } from 'crypto';
import { emailStore } from '../lib/emailStore';
import { SMTP_CONFIG } from '../lib/config';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startWebApp(): Promise<http.Server> {
  await app.prepare();

  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Invalid request');
      return;
    }

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl).catch((error) => {
      console.error('Request handling failed', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });

  return new Promise((resolve) => {
    server.listen(SMTP_CONFIG.WEB_PORT, () => {
      console.log(`➜ Web interface ready on http://localhost:${SMTP_CONFIG.WEB_PORT}`);
      resolve(server);
    });
  });
}

function startSmtpServer(): SMTPServer {
  const smtpServer = new SMTPServer({
    authOptional: false,
    disabledCommands: ['STARTTLS'],
    logger: false,
    banner: 'GhostMailDev local SMTP server',
    onAuth(auth: SMTPServerAuthentication, _session: SMTPServerSession, callback) {
      const { username, password } = auth;
      if (username === SMTP_CONFIG.USERNAME && password === SMTP_CONFIG.PASSWORD) {
        return callback(null, { user: username });
      }
      return callback(new Error('Invalid username or password'));
    },
    async onData(stream, session, callback) {
      try {
        const parsed = await simpleParser(stream);
        const id = randomUUID();
        const recipients = session.envelope?.rcptTo?.map((address) => address.address) || [];
        const mailFromAddress =
          session.envelope?.mailFrom && typeof session.envelope.mailFrom !== 'boolean'
            ? session.envelope.mailFrom.address
            : undefined;

        await emailStore.append({
          id,
          from: parsed.from?.text || mailFromAddress || 'unknown@localhost',
          to: recipients,
          subject: parsed.subject || '(no subject)',
          text: parsed.text || '',
          html: parsed.html || undefined,
          date: (parsed.date || new Date()).toISOString(),
          raw: parsed.textAsHtml || parsed.text || ''
        });

        console.log(`📬 Stored email ${id} -> ${recipients.join(', ') || 'undisclosed recipients'}`);
        callback();
      } catch (error) {
        console.error('Failed to process incoming email', error);
        callback(error as Error);
      }
    }
  });

  smtpServer.on('error', (error) => {
    console.error('SMTP server error', error);
  });

  smtpServer.listen(SMTP_CONFIG.PORT, SMTP_CONFIG.HOST, () => {
    console.log(`➜ SMTP server listening on ${SMTP_CONFIG.HOST}:${SMTP_CONFIG.PORT}`);
  });

  return smtpServer;
}

async function bootstrap() {
  await emailStore.getAll(); // ensure the store file exists
  await startWebApp();
  startSmtpServer();
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap GhostMailDev', error);
  process.exit(1);
});
