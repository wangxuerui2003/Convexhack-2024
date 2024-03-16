import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ConvexClientProvider from '@/components/ConvexClientProvider';

export const metadata: Metadata = {
  title: 'Animal-G',
  description: 'Railway Station Animal Detector',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-green-100'>
        <Navbar />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
