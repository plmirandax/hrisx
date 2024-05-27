import { auth } from '@/auth';
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';



const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div>
      <html lang="en">
      <body className={`${inter.className} w-full h-full`}>
        <div suppressHydrationWarning>
        <Header />
        <Toaster />
        {children}
        </div>
      </body>
    </html>
      </div>
    
    </SessionProvider>
  );
}
