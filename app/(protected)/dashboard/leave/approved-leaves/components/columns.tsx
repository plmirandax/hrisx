"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import { UserCircle } from "lucide-react";
import { Leaves } from "../data/schema";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApproveLeaveSchema } from "@/schemas";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ApproveLeaveRequest } from "@/actions/queries";

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
            setSuccess(data.success);
            
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
      const status = row.original.status; // Accessing the status value from the row data
  
      return (
        <Badge variant='success'>{status}</Badge>
      );
    }
  },
  {
    accessorKey: "pmdRemarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PMD Remarks" />
    ),
  },
];
