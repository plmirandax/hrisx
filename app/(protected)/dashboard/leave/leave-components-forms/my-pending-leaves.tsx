'use client'
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowUpRight, CheckCheckIcon, Hourglass, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';

export default function MyPendingLeaveForm() {
  const [leaves, setLeaves] = useState([]);
  const [leavesApproved, setLeavesApproved] = useState([]);
  const [leavesDeclined, setLeavesDeclined] = useState([]);
  const [leavesTotal, setLeavesTotal] = useState([]);
  const user = useCurrentUser();
  

  const FETCH_INTERVAL = 5000; // 5 seconds

  useEffect(() => {
    let intervalId: NodeJS.Timeout; // Type for Node.js environment. Use `number` if in a browser environment.
  
    async function fetchData() {
      try {
        const response = await axios.post('/api/fetch-leaves-pending', { userId: user?.id }, {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate'
          }
        }); // This gets the leave requests of the logged-in user, change to approverId if you want to get the for approval of leave requests.
  
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
      fetchData(); // Initial fetch
      intervalId = setInterval(fetchData, FETCH_INTERVAL); // Subsequent fetches every 5 seconds
    }
  
    return () => clearInterval(intervalId); // Cleanup on unmount or when user changes
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
        <div className="flex-1 overflow-auto mt-8">
          <Card>
            <CardHeader className='font-semibold'>
              Pending Leave Details
            </CardHeader>
            <CardContent>
            <Suspense fallback={<Skeleton />}>
            <DataTable data={leaves} columns={columns} />
          </Suspense>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
