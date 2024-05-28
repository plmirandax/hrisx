import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLeaveTypeForm } from "../_components/create-leave-type"
import { fetchLeaveType } from "../_data/fetch-leave-type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export const metadata: Metadata = {
  title: "Settings",
  description: "Advanced form example using react-hook-form and Zod.",
}

export default async function SettingsProfilePage() {

  const leaveTypes = await fetchLeaveType();

  return (
<div className="flex space-x-8 justify-center">
  <div>
  <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account, system settings and set e-mail preferences.
          </p>
          <Separator className="my-6"/>
  </div>

      <CreateLeaveTypeForm />
      <div>
      <Card className="xl:col-span-2 w-[650px]">
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
                    .map(leaveType => (
                      <TableBody key={leaveType.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="font-medium">
                              <Badge>{leaveType.name}</Badge>
         
                              </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='secondary'>
                            {leaveType.description}
                            </Badge>
                   
                            </TableCell>
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
    
  )
}