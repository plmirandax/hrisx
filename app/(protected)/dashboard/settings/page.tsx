import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpRight, MoreHorizontal, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { fetchDepartment } from '../_data/fetch-department'
import { fetchLeaveType } from '../_data/fetch-leave-type'
import { Label } from '@/components/ui/label'
import { prisma } from '@/lib/db'
import { CreateDeptForm } from '../_components/create-dept'
import { CreateLeaveTypeForm } from '../_components/create-leave-type'




function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export default async function SettingsPage (){
  const departments = await fetchDepartment();
  const leaveTypes = await fetchLeaveType();

  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full ml-4 items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              System Settings
            </Link>
            <Link href="#">Profile</Link>
            <Link href="#">Security</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className='flex items-center justify-center mr-[275px] mt-[-80px]'>
          <CreateDeptForm />
          <CreateLeaveTypeForm />
          </div>

          <div className='flex w-max'>
          <Card className="xl:col-span-2 w-[650px] ml-[275px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="grid gap-2">
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>Your list of departments.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {departments
                    .reverse()
                    .slice(0, 5) // Limit to the last 5 records
                    .map(department => (
                      <TableBody key={department.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="font-medium">{department.name}</div>
                          </TableCell>
                          <TableCell>{department.description}</TableCell>
                          <TableCell>
                            <Badge className="text-xs" variant="outline">
                              {formatDate(new Date(department.createdAt).toISOString())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))}
                </Table>
              </CardContent>
            </Card>
            <Card className="xl:col-span-2 w-[650px] ml-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="grid gap-2">
                    <CardTitle>Leave Types</CardTitle>
                    <CardDescription>Your list of leave types.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {leaveTypes
                    .slice(0, 5) // Limit to the last 5 records
                    .map(leaveType => (
                      <TableBody key={leaveType.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="font-medium">{leaveType.name}</div>
                          </TableCell>
                          <TableCell>{leaveType.description}</TableCell>
                          <TableCell>
                            <Badge className="text-xs" variant="outline">
                              {formatDate(new Date(leaveType.createdAt).toISOString())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))}
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
