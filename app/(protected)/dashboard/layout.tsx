'use client'

import { auth } from '@/auth';
import Header from '@/components/header/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


  return (

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

  );
}
