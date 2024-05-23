"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { CalendarCheck, FileTextIcon, Settings, Users2Icon } from "lucide-react"
import { FaTasks } from "react-icons/fa"
import { useCurrentUser } from "@/hooks/use-current-user"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "View Payslip 💵",
    href: "/dashboard/payslip",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
]

export function SystemMenu() {

  const user = useCurrentUser();

  const isAdmin = user?.role === 'Administrator';
  const isUser = user?.role === 'User';
  const isPMD = user?.role === 'PMD';
  const isApprover = user?.role === 'Approver';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger><CalendarCheck className="h-4 w-4 mr-2"/>Leave Management</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid p-4 md:w-[200px] lg:w-[200px]">
              <ListItem href="/dashboard/leave" title="My Leave Page 🗓️">
           
              </ListItem>
              {(isPMD || isApprover || isAdmin) && (
              <ListItem href="/dashboard/leave/approver" title="For Approval ✅">
            
              </ListItem>
              )}
              {(isPMD || isAdmin) && (
              <ListItem href="/dashboard/leave/pmd-posting" title="PMD Approval ✅">
             
              </ListItem>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {(isAdmin || isPMD) && (
        <NavigationMenuItem>
          <NavigationMenuTrigger><Users2Icon className="h-4 w-4 mr-2"/>Employee Management</NavigationMenuTrigger>
          <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/dashboard/employee-management" title="Employee Dashboard 👨‍👩‍👧‍👧">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/dashboard/employee-management/reports" title="Employee Management Reports 📈">
                How to install dependencies and structure your app.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
          )}
          <NavigationMenuItem>
          <Link href="/dashboard/payslip" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <FileTextIcon className="h-4 w-4 mr-2"/>View Payslip
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/kanban" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <FaTasks className="h-4 w-4 mr-2"/>Kanban Board
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/settings" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Settings className="h-4 w-4 mr-2"/>Settings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
