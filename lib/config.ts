export const SMTP_CONFIG = {
  HOST: process.env.SMTP_HOST || '0.0.0.0',
  PORT: Number(process.env.SMTP_PORT || 2525),
  DOMAIN: process.env.SMTP_DOMAIN || 'ghostmail.local',
  USERNAME: process.env.SMTP_USERNAME || 'ghost',
  PASSWORD: process.env.SMTP_PASSWORD || 'ghostmail',
  WEB_PORT: Number(process.env.PORT || 3002)
};

export const STORAGE_PATH = process.env.EMAIL_STORE_PATH || 'data/emails.json';
