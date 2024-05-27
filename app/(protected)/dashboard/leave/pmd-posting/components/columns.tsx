"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useState, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Leaves } from "../data/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApprovePMDSchema } from "@/schemas";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Statuses } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ApprovePMDRequest } from "@/actions/approve-leave-pmd";
import { toast } from "sonner";
import Image from "next/image";

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
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ApprovePMDSchema>>({
    resolver: zodResolver(ApprovePMDSchema),
    defaultValues: {
      status: undefined,
      pmdStatus: undefined,
      pmdRemarks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ApprovePMDSchema>) => {
    setError("");
    setSuccess("");
  
    // Check if selectedLeaves is not null and selectedLeaves.id is a string
    if (selectedLeaves?.id) {
      startTransition(() => {
        // Determine the status based on pmdStatus
        let newStatus: "Approved" | "Declined";
  
        if (values.pmdStatus === Statuses.Declined) {
          newStatus = "Declined";
        } else {
          newStatus = "Approved"; // Default to "Approved" if pmdStatus is not "Declined"
        }
  
        // Include the updated status in the request
        ApprovePMDRequest({ ...values, id: selectedLeaves.id, status: newStatus })
          .then((data) => {
            setError(data.error);
            toast.success("Leave request has been posted.");
  
            if (!data.error) {
              form.reset();
              handleCloseModal();
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
            <div className="flex space-x-4">
          
              <div className="w-1/2">
                <div>
                <FormLabel className="font-semibold">Name</FormLabel>
                      <Input
                        value={`${selectedLeaves?.user.firstName || ''} ${selectedLeaves?.user.lastName || ''}`}
                        disabled={isPending}
                        readOnly
                      />
                </div>
              </div>
              <div className="w-1/2">
              <FormLabel className="font-semibold">Leave Type</FormLabel>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={selectedLeaves?.leaveType} aria-readonly />
                              </SelectTrigger>
                            </Select>
              </div>
              
            </div>
            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
              <FormLabel className="font-semibold">Start Date</FormLabel>
                        <Input value={selectedLeaves?.startDate} readOnly />
              </div>
              <div className="w-1/2">
              <FormLabel className="font-semibold">End Date</FormLabel>
                        <Input value={selectedLeaves?.endDate} readOnly />
              </div>
            </div>
            <div className="mt-4 mb-4">
            <FormLabel className="font-semibold">Reason</FormLabel>
                      <Textarea
                        value={selectedLeaves?.reason}
                        disabled
                        placeholder="Enter reason here..."
                        className="h-[100px]"
                        readOnly
                      />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
              <FormLabel className="font-semibold">Approver Status</FormLabel>
                        <Input value={selectedLeaves?.status} readOnly className="mt-2" />
              </div>
              
              <div className="w-1/2">
              <FormLabel className="font-semibold">Approver Remarks</FormLabel>
                        <Input value={selectedLeaves?.approverRemarks} readOnly className="mt-2" />
              </div>
            </div>
            
            <div className="mt-4 mb-4">
              <FormField
                control={form.control}
                name="pmdStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">PMD Status</FormLabel>
                    <FormControl>
                      <Controller
                        name="pmdStatus"
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
                name="pmdRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">PMD Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Enter approver remarks here..."
                        className="h-[70px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full mt-4">
              Update Leave Request
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
    // Use a custom cell renderer to conditionally render the image or default user icon
    cell: ({ row }) => {
      const image = row.original.user.image; // Accessing the image value from the row data
  
      return (
        <div className="flex items-center">
          {image ? (
            <Image src={image} alt="User" className="h-8 w-8 rounded-full" />
          ) : (
            <UserCircle className="h-8 w-8 text-gray-400" />
          )}
        </div>
      );
    }
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
     // Use a custom cell renderer to display the content as a badge
     cell: ({ row }) => {
      const leaveType = row.original.leaveType; // Accessing the status value from the row data
      return (
        <Badge variant='secondary'>{leaveType}</Badge>
      );
    }
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
     // Use a custom cell renderer to display the content as a badge
     cell: ({ row }) => {
      const startDate = row.original.startDate; // Accessing the status value from the row data
      return (
        <Badge variant='outline'>{startDate}</Badge>
      );
    }
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
         // Use a custom cell renderer to display the content as a badge
         cell: ({ row }) => {
          const endDate = row.original.endDate; // Accessing the status value from the row data
          return (
            <Badge variant='outline'>{endDate}</Badge>
          );
        }
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
  
  
  
      return (
        <Badge variant='success'>{status}</Badge>
      );
    }
  },
  {
    accessorKey: "approverRemarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approver Remarks" />
    ),
  },
  {
    accessorKey: "pmdStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PMD Status" />
    ),
    // Use a custom cell renderer to display the content as a badge
    cell: ({ row }) => {
      const pmdStatus = row.original.pmdStatus; // Accessing the status value from the row data
  

  
      return (
        <Badge>{pmdStatus}</Badge>
      );
    }
  },
  {
    accessorKey: "pmdRemarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PMD Remarks" />
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: CellComponent, // Use the component you defined above
  },
];
