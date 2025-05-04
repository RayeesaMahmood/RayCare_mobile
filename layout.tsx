
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for better readability
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header'; // Import the header component
import Chatbot from '@/components/chatbot'; // Import the Chatbot component

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Use --font-sans as defined in globals.css
});

export const metadata: Metadata = {
  title: 'RayCare Mobile', // Updated title
  description: 'Queue management for RayCare', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header /> {/* Add the header */}
          <main className="flex-1">{children}</main>
        </div>
        <Chatbot /> {/* Add the Chatbot component */}
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
