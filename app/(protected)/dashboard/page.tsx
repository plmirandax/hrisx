
import { Activity, CheckCheckIcon, Hourglass, Trash, } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLeaveForm } from "./_components/leave-form";
import MyPendingLeaveForm from "./leave/leave-components-forms/my-pending-leaves";
import ApproverLeaveForm from "./leave/leave-components-forms/approver-form";
import PMDApproverForm from "./leave/leave-components-forms/pmd-approver";
import ApprovedLeavePage from "./leave/approved-leaves/approved-leaves";
import LeaveHistoryForm from "./leave/leave-components-forms/leave-history";
import { fetchLeaveDataApprover, fetchLeaveDataUser, fetchLeaveDataUserApproved, fetchSubordinates } from "@/actions/queries";


export default async function LeaveDashboard() {
  const user = await auth();

  if (!user) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  const isAdmin = user.user.role === 'Administrator';
  const isUser = user.user.role === 'User';
  const isApprover = user.user.role === 'Approver'
  const isPMD = user.user.role === 'PMD';

  if (!isAdmin && !isUser && !isPMD && !isApprover) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  const subordinates = await fetchSubordinates(user.user.id);
  const leaves = await fetchLeaveDataApprover(user.user.id);
  const leavesUser = await fetchLeaveDataUser(user.user.id);
  const leavesApproved = await fetchLeaveDataUserApproved(user.user.id);
  const pendingLeaves = leavesUser.filter(leave => leave.status === 'Pending');
  const totalPendingLeaves = pendingLeaves.length;
  const approvedLeaves = leavesUser.filter(leave => leave.status === 'Approved');
  const totalApprovedLeaves = approvedLeaves.length;
  const declinedLeaves = leavesUser.filter(leave => leave.status === 'Declined');
  const totalDeclinedLeaves = declinedLeaves.length;
  const totalLeaves = leavesUser.length;

  return (
    <div className="flex flex-1 max-h-screen w-full flex-col">
      <div className="flex justify-between items-center mb-[-8px] ml-8 mr-8 mt-3">
        <Label className="text-2xl font-bold">Welcome to your Dashboard, {user.user.firstName}!</Label>
        <CreateLeaveForm />
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalPendingLeaves}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
              <CheckCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalApprovedLeaves}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declined Leaves</CardTitle>
              <Trash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalDeclinedLeaves}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted Leaves</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalLeaves}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="myPending" className="space-y-4">
          <div className="flex justify-center w-full space-x-4 mb-[-30px]">
          <TabsList>
            <TabsTrigger value="myPending">My Leaves</TabsTrigger>
              <TabsTrigger value="forApproval">Approved Leaves</TabsTrigger>
              <TabsTrigger value="forPosting">Leave History</TabsTrigger>
            </TabsList>
          </div>
            
            <TabsContent value="myPending" className="space-y-4 mt-[-20px]">
            <div className="flex gap-2 md:grid-cols-2 mb-[-20px]">
              <div className="w-full">
                  <MyPendingLeaveForm />
              </div>
              </div>
            </TabsContent>
            <TabsContent value="forApproval" className="space-y-4">
            <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
              <ApprovedLeavePage />
              </div>

  
  </div>
</TabsContent>
<TabsContent value="forPosting" className="space-y-4">
            <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
              <LeaveHistoryForm />
              </div>

  
  </div>
</TabsContent>
          </Tabs>

      </main>
    </div>
  );
}
