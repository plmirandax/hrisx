'use client'
import { Suspense, useEffect, useState } from 'react';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios

export default function ApproverLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/fetch-leaves-approver', { approverId: user?.approverId }); // THis get's the leave requests of the logged in user, change to approverId if you want to get the for approval of leave requests.
  
        if (!response.data) {
          throw new Error('Failed to fetch leave data');
        }
  
        setLeaves(response.data.leaves);
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
      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-col space-y-5">
          <h2 className="text-2xl font-bold tracking-tight">For Approval Leave Requests</h2>
          <p className="text-muted-foreground">
            This is where you can manage your for approval leave requests.
          </p>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<Skeleton />}>
            <DataTable data={leaves} columns={columns} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
