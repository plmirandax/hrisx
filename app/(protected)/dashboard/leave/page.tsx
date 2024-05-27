'use client'
import { Suspense, useEffect, useState } from 'react';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowUpRight, CheckCheckIcon, Hourglass, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [leavesApproved, setLeavesApproved] = useState([]);
  const [leavesDeclined, setLeavesDeclined] = useState([]);
  const [leavesTotal, setLeavesTotal] = useState([]);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/fetch-leaves-pending', { userId: user?.id }); // THis get's the leave requests of the logged in user, change to approverId if you want to get the for approval of leave requests.
  
        if (!response.data) {
          throw new Error('Failed to fetch leave data');
        }
  
        setLeaves(response.data.leaves);
        setLeavesApproved(response.data.leavesApproved);
        setLeavesDeclined(response.data.leavesDeclined);
        setLeavesTotal(response.data.leavesTotal);
      } catch (error) {
        toast.error('There was an error in fetching leave requests.');
      }
    }
  
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col p-4 mt-[-10px]">
      <h2 className="text-2xl font-bold tracking-tight">Your pending leave requests.</h2>
          <p className="text-muted-foreground mt-[-4px]">
            This is where you can manage your pending leave requests.
          </p>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
        
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{leaves.length}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium mr-4">Approved Leaves</CardTitle>
              <CheckCheckIcon className="h-4 w-4 text-muted-foreground" />
              <Button asChild size="sm" className="ml-auto mr-4">
                    <Link href="/dashboard/leave/approved-leaves">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{leavesApproved.length}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium mr-4">Declined Leaves</CardTitle>
              <Trash className="h-4 w-4 text-muted-foreground" />
              <Button asChild size="sm" className="ml-auto mr-4">
                    <Link href="/dashboard/leave/declined-leaves">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{leavesDeclined.length}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium mr-4">Submitted Leaves</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Button asChild size="sm" className="ml-auto mr-4">
                    <Link href="/dashboard/employee-management">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{leavesTotal.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 overflow-auto mt-8">
          <Card>
            <CardHeader className='font-semibold'>
              Leave Details
            </CardHeader>
            <CardContent>
            <Suspense fallback={<Skeleton />}>
            <DataTable data={leaves} columns={columns} />
          </Suspense>
            </CardContent>
  
          </Card>
 
        </div>
      </div>
    </div>
  )
}
