import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // This was causing the error
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Branch Buddy',
  description: 'School Management System for Multi-Branch Institutions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Use GeistSans for both variable --font-geist-sans and --font-geist-mono to resolve the module not found error */}
      <body className={`${GeistSans.variable} ${GeistSans.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
