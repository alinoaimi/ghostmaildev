import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from './providers';
import AppFrame from '@/components/AppFrame';

export const metadata: Metadata = {
  title: 'GhostMailDev',
  description: 'Local-only SMTP server with a simple web inbox and composer'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppFrame>{children}</AppFrame>
        </AppProviders>
      </body>
    </html>
  );
}
