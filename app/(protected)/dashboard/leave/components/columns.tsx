"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PenIcon, Trash, UserCircle } from "lucide-react";
import { Leaves } from "../data/schema";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApproveLeaveSchema } from "@/schemas";
import { z } from "zod";
import { ApproveLeaveRequest } from "@/actions/approve-leave";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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

  return (
    <>
    <div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' className="w-8 h-8 p-0">
        <MoreHorizontal className="h-4 w-4"/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleOpenModal}>
          Edit <PenIcon className="h-3.5 w-3.5 ml-4"/>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenModal}>
          Delete <Trash className="h-3.5 w-3.5 ml-4" />
        </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
    </div>
    
    </>
    
  )

};



export const columns: ColumnDef<Leaves>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="hidden sm:table-cell">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.image",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="" />
      </div>
    ),
    cell: ({ row }) => {
      const image = row.original.user.image;
      return (
        <div className="hidden sm:table-cell flex items-center">
          {image ? (
            <Image src={image} alt="User" className="h-8 w-8 rounded-full" />
          ) : (
            <UserCircle className="h-8 w-8 text-gray-400" />
          )}
        </div>
      );
    },
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
    cell: ({ row }) => {
      const leaveType = row.original.leaveType;
      return <Badge variant="secondary">{leaveType}</Badge>;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Start Date" />
      </div>
    ),
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return (
        <div className="hidden sm:table-cell">
          <Badge variant="outline">{startDate}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="End Date" />
      </div>
    ),
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      return (
        <div className="hidden sm:table-cell">
          <Badge variant="outline">{endDate}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Reason" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.reason}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Approver Status" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="hidden sm:table-cell">
          <Badge variant="pending">{status}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: CellComponent,
  },
];