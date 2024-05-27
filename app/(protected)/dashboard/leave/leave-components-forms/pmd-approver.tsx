'use client'
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCheckIcon, Hourglass, Trash } from 'lucide-react';
import { DataTable } from '../pmd-posting/components/data-table';
import { columns } from '../pmd-posting/components/columns';

export default function PMDApproverForm() {
  const [leaves, setLeaves] = useState([]);
  const [leavesApproved, setLeavesApproved] = useState([]);
  const [leavesDeclined, setLeavesDeclined] = useState([]);
  const [leavesTotal, setLeavesTotal] = useState([]);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/fetch-leaves-approver-pmd', { userId: user?.id }); // THis get's the leave requests of the logged in user, change to approverId if you want to get the for approval of leave requests.
  
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
        <div className="flex-1 overflow-auto mt-8">
        <Card>
            <CardHeader className='font-semibold'>
              For Posting Leave Details
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
