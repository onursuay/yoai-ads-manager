import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YOAİ - AI-Powered Ads Manager',
  description: 'Manage your Meta and Google Ads with AI-powered recommendations',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
