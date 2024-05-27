'use client'
import { Suspense, useEffect, useState } from 'react';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCheckIcon, Hourglass, Trash, User2Icon } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [employeesApprover, setEmployeeApprover] = useState([]);
  const [employeesTotal, setEmployeesTotal] = useState([]);
  const user = useCurrentUser();

  useEffect(() => {
    fetch('/api/fetch-employees') // replace with your API route
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setEmployees(data.employees))
      .catch(() => toast.error('An error occurred while fetching leave types. Please try again.'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col p-4 mt-[-10px]">
      <h2 className="text-2xl font-bold tracking-tight">Employee Management</h2>
          <p className="text-muted-foreground">
            This is where you can manage your for employees.
          </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total # of Employees</CardTitle>
              <User2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{employees.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 overflow-auto mt-8">
        <Card>
            <CardHeader className='font-semibold'>
              Employee Details
            </CardHeader>
            <CardContent>
            <Suspense fallback={<Skeleton />}>
            <DataTable data={employees} columns={columns} />
          </Suspense>
            </CardContent>
  
          </Card>
 
        </div>
      </div>
    </div>
  )
}
