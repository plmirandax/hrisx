// /dashboard/layout.tsx

import { auth } from '@/auth';
import Header from '@/components/header/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Advanced form example using react-hook-form and Zod.",
}

const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className={`${inter.className} w-full h-full`}>
        <Header />
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <Toaster />
        {children}
        </ThemeProvider>
      </body>
    </html>
  </SessionProvider>
  );
}
