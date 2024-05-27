"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Leaves } from "../data/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApproveLeaveSchema } from "@/schemas";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Statuses } from "@prisma/client";
import { ApproveLeaveRequest } from "@/actions/approve-leave";
import { Badge } from "@/components/ui/badge";

type LeaveType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

type RowData = Row<Leaves>;
const CellComponent = ({ row }: { row: RowData }) => {
  const leaves = row.original;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<Leaves | null>(null);

  const handleOpenModal = () => {
    setSelectedLeaves(leaves);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLeaves(null);
    setIsOpen(false);
  };

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  useEffect(() => {
    fetch('/api/fetch-leave-type') // replace with your API route
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setLeaveTypes(data.leaveTypes))
      .catch(() => toast.error('An error occurred while fetching leave types. Please try again.'));
  }, []);

  const form = useForm<z.infer<typeof ApproveLeaveSchema>>({
    resolver: zodResolver(ApproveLeaveSchema),
    defaultValues: {
      status: undefined,
      approverRemarks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ApproveLeaveSchema>) => {
    setError("");
    setSuccess("");
  
    // Check if selectedLeaves is not null and selectedLeaves.id is a string
    if (selectedLeaves?.id) {
      startTransition(() => {
        ApproveLeaveRequest({ ...values, id: selectedLeaves.id }) // Include the leave ID in the request
          .then((data) => {
            setError(data.error);
            toast.success("Leave request updated successfully.")
            
            if (!data.error) {
              form.reset();
            }
          })
          .finally(() => {
            setTimeout(() => {
              setError(undefined);
              setSuccess(undefined);
            }, 5000);
          });
      });
    } else {
      setError("Selected leave is not valid");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className="w-8 h-8 p-0">
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleOpenModal}>
              View Leave Details
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex justify-center items-center z-50">
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[550px]">
            <CardTitle>Leave Details
              <CardDescription className="mb-4">Fill in the form below to update tenant details.</CardDescription>
             
              <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <FormLabel>Name</FormLabel>
                      <Input
                        value={`${selectedLeaves?.user.firstName || ''} ${selectedLeaves?.user.lastName || ''}`}
                        readOnly
                        className="mt-2"
                      />
              </div>
              <div className="w-1/2">
              <FormLabel>Leave Type</FormLabel>
              <Input value={selectedLeaves?.leaveType} readOnly className="mt-2 font-xl" />
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
              <FormLabel>Start Date</FormLabel>
                        <Input value={selectedLeaves?.startDate} readOnly className="mt-2" />
              </div>
              <div className="w-1/2">
              <FormLabel>End Date</FormLabel>
                        <Input value={selectedLeaves?.endDate} readOnly className="mt-2" />
              </div>
            </div>
            <div className="mt-4 mb-4">
            <FormLabel>Reason</FormLabel>
                      <Textarea
                        value={selectedLeaves?.reason}
                        placeholder="Enter reason here..."
                        className="h-[60px] mt-2"
                        readOnly
                      />
            </div>
            <div>
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approver Status</FormLabel>
                    <FormControl>
                      <Controller
                        name="status"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Statuses.Approved}>Approve</SelectItem>
                              <SelectItem value={Statuses.Declined}>Decline</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4 mb-4">
              <FormField
                control={form.control}
                name="approverRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approver Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Enter approver remarks here..."
                        className="h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full mt-4">
              Submit Leave
            </Button>
          </form>
        </Form>
            </CardTitle>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export const columns: ColumnDef<Leaves>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" />
    ),
  },
  {
    id: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.user.firstName} {row.original.user.lastName}
      </span>
    ),
  },
  {
    accessorKey: "leaveType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Type" />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
  },

  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approver Status" />
    ),
    // Use a custom cell renderer to display the content as a badge
    cell: ({ row }) => {
      const status = row.original.status; // Accessing the status value from the row data
  
      // Determine badge color based on status
      let badgeColor;
      switch (status) {
        case 'Pending':
          badgeColor = 'warning';
          break;
        case 'Approved':
          badgeColor = 'success';
          break;
        case 'Rejected':
          badgeColor = 'danger';
          break;
        default:
          badgeColor = 'primary';
      }
  
      return (
        <Badge color={badgeColor}>{status}</Badge>
      );
    }
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: CellComponent, // Use the component you defined above
  },
];
