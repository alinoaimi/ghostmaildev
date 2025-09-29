import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SMTP_CONFIG } from '@/lib/config';

interface SendPayload {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as SendPayload;
  const { from, to, subject, text, html } = payload;

  if (!from || !to || !subject || (!text && !html)) {
    return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
  }

  const recipients = to
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return NextResponse.json({ success: false, message: 'Provide at least one recipient.' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: SMTP_CONFIG.PORT,
      secure: false,
      auth: {
        user: SMTP_CONFIG.USERNAME,
        pass: SMTP_CONFIG.PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from,
      to: recipients,
      subject,
      text,
      html
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Failed to send email', error);
    return NextResponse.json({ success: false, message: 'Failed to deliver email.' }, { status: 500 });
  }
}
