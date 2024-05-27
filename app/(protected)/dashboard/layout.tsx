import { auth } from '@/auth';
import Header from '@/components/header/header';
import { SideBarNav } from '@/components/sidebar/sidebar';
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
        <SideBarNav />
        {children}
        </div>
      </body>
    </html>
      </div>
    
    </SessionProvider>
  );
}
