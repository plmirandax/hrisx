'use client'
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../declined-leaves/components/data-table';
import { columns } from '../declined-leaves/components/columns';

export default function LeaveHistoryForm() {
  const [leaves, setLeaves] = useState([]);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/fetch-leaves-history', { userId: user?.id }); // THis get's the leave requests of the logged in user, change to approverId if you want to get the for approval of leave requests.
  
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
      <div className="flex-1 overflow-auto mt-8">
      <Card>
            <CardHeader className='font-semibold'>
              Leave History
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
