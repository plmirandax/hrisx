'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Link from 'next/link'
import { CircleUser, ClipboardListIcon, FileTextIcon, HomeIcon, Menu, Package2, Search, Settings, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ModeToggle } from '../theme-toggle'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import TeamSwitcher from './team-switcher'
import { SystemMenu } from './system-menu'


export function Header (){

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Sign out and redirect to homepage
    router.push('/'); // Navigate to the homepage
  };

  return (
    <div className="flex w-full flex-col mb-4">
<header className="sticky top-0 flex h-16 items-center gap-6 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <TeamSwitcher />
        <SystemMenu />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
        <TeamSwitcher className="mt-4" />
      </Link>
      <Link href="#" className="flex items-center gap-2 hover:text-foreground">
        <HomeIcon className="h-5 w-5" />
        Dashboard
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ClipboardListIcon className="h-5 w-5" />
        Leave Management
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <FileTextIcon className="h-5 w-5" />
        Payslip Management
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <User className="h-5 w-5" />
        Profile
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
        Settings
      </Link>
    </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <div className='mb-2 mr-2'>
           {/*  <ModeToggle /> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}

export default Header
