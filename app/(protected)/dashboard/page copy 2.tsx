import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CheckCheckIcon,
  DollarSignIcon,
  Hourglass,
  MoreHorizontal,
  PlusCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { auth } from "@/auth"
import { fetchLeaveData } from "./_data/fetchdata"
import { LeaveForm } from "./_components/leave-form"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default async function Dashboard() {

  const user = await auth();

  if (!user) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  if (user?.user.role !== 'Administrator') {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  const leaves = await fetchLeaveData(user?.user.id);
  const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
  const totalPendingLeaves = pendingLeaves.length
  const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');
  const totalApprovedLeaves = approvedLeaves.length

  return (
    <div className="flex min-h-screen w-full flex-col">
        <div className="mb-[-8px] ml-8">
        <Label className="text-2xl font-bold">Welcome to your dashboard, {user?.user.firstName}!</Label>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Leaves
              </CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalPendingLeaves}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Leaves
              </CardTitle>
              <CheckCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalApprovedLeaves}</div>
              {/* <div className="ml-8 mt-[-8px]">
              <Button asChild size="sm">
                <Link href="#">
                  View All
                <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
  </div> */}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declined Leaves</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">+12,234</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted Leaves</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
        </div>
        <div className="mb-[-8px] mt-[-8px]">
          <LeaveForm />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="xl:col-span-2">
  <CardHeader className="flex flex-row items-center justify-between">
    <div className="flex flex-row items-center justify-between w-full">
      <div className="grid gap-2">
        <CardTitle>Pending Leave Transactions</CardTitle>
        <CardDescription>Your pending leave transactions.</CardDescription>
      </div>
      <Button asChild size="sm" className="ml-auto mr-4">
        <Link href="/dashboard/leave">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </CardHeader>
  <CardContent>
  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Start Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          End Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Reason
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="/placeholder.svg"
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          Laser Lemonade Machine
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Draft</Badge>
                        </TableCell>
                        <TableCell>$499.99</TableCell>
                        <TableCell className="hidden md:table-cell">
                          25
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-07-12 10:42 AM
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
                  </Table>
  </CardContent>
</Card>

          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
            <div className="flex flex-row items-center justify-between w-full">
      <div className="grid gap-2">
        <CardTitle>Payslip History</CardTitle>
        <CardDescription>Your payslip history.</CardDescription>
      </div>
      <Button asChild size="sm" className="ml-auto mr-4">
        <Link href="/dashboard/leave">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
            <div className="flex flex-row items-center justify-between w-full">
      <div className="grid gap-2">
        <CardTitle>Subordinates</CardTitle>
        <CardDescription>Your subordinates.</CardDescription>
      </div>
      <Button asChild size="sm" className="ml-auto mr-4">
        <Link href="/dashboard/leave">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
