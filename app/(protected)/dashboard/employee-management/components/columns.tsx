"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useState, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCircle, } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Form, FormLabel } from "@/components/ui/form";
import {  useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApproveLeaveSchema } from "@/schemas";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Employees } from "../data/schema";
import Image from "next/image";
import { ApproveLeaveRequest } from "@/actions/queries";

type LeaveType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

type RowData = Row<Employees>;
const CellComponent = ({ row }: { row: RowData }) => {
  const employees = row.original;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employees | null>(null);

  const handleOpenModal = () => {
    setSelectedEmployees(employees);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployees(null);
    setIsOpen(false);
  };

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();


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
    if (selectedEmployees?.id) {
      startTransition(() => {
        ApproveLeaveRequest({ ...values, id: selectedEmployees.id }) // Include the leave ID in the request
          .then((data) => {
            setError(data.error);
            toast.success("Leave request updated successfully.")
            
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
              View Employee Details
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex justify-center items-center z-50">
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[550px]">
            <CardTitle>Employee Details
              <CardDescription className="mb-4">Fill in the form below to update employee details.</CardDescription>
             
              <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <FormLabel>Name</FormLabel>
                      <Input
                        value={`${selectedEmployees?.firstName || ''} ${selectedEmployees?.lastName || ''}`}
                        readOnly
                        className="mt-2"
                      />
              </div>
              <div className="w-1/2">
              <FormLabel>Email</FormLabel>
              <Input value={selectedEmployees?.email} readOnly className="mt-2 font-xl" />
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
              <FormLabel>Contact No.</FormLabel>
                        <Input value={selectedEmployees?.contactNo} readOnly className="mt-2" />
              </div>
              <div className="w-1/2">
              <FormLabel>Address</FormLabel>
                        <Input value={selectedEmployees?.address} readOnly className="mt-2" />
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
              <FormLabel>Department</FormLabel>
                        <Input value={selectedEmployees?.department} readOnly className="mt-2" />
              </div>
              <div className="w-1/2">
              <FormLabel>Role</FormLabel>
                        <Input value={selectedEmployees?.role} readOnly className="mt-2" />
              </div>
            </div>
            {/*
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
              */}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full mt-4">
              Update Employee Details
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

export const columns: ColumnDef<Employees>[] = [
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
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" />
    ),
    // Use a custom cell renderer to conditionally render the image or default user icon
    cell: ({ row }) => {
      const image = row.original.image; // Accessing the image value from the row data
  
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
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Address" />
    ),
  },
  {
    accessorKey: "contactNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact No." />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    // Use a custom cell renderer to display the content as a badge
    cell: ({ row }) => {
      const role = row.original.role; // Accessing the status value from the row data
  
  
      return (
        <Badge variant='default'>{role}</Badge>
      );
    }
  },

  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),

    cell: ({ row }) => {
      const department = row.original.department; // Accessing the status value from the row data
  
  
      return (
        <Badge variant='secondary'>{department}</Badge>
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
