"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "./data-table-column-header"
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { SelectSeparator } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ForApproval } from "./data/schema";
import { Textarea } from "@/components/ui/textarea";


type RowData = Row<ForApproval>;
const CellComponent = ({ row }: { row: RowData }) => {
  const leaveRequest = row.original;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ForApproval | null>(null);

  const handleOpenModal = () => {
    setSelectedLeaveRequest(leaveRequest);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLeaveRequest(null);
    setIsOpen(false);
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
              Edit
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex justify-center items-center z-50">
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[750px]">
            <CardTitle>Leave Details
              <CardDescription>Fill in the form below to update tenant details.</CardDescription>
              <SelectSeparator />
              <div className="flex flex-col items-center justify-center py-4">
                  <div className="flex">
                    <div className="w-1/2 mt-1 pl-4">
                      <Label htmlFor="leaveType" className="text-right">Leave Type</Label>
                      <Input id="leaveType" name="leaveType" value={selectedLeaveRequest?.leaveType} disabled />
                    </div>
                    <div className="w-1/2 mt-1 pl-4">
                      <Label htmlFor="startDate" className="text-right">Start Date</Label>
                      <Input id="startDate" name="startDate" value={selectedLeaveRequest?.startDate || ''} disabled />
                    </div>
                    <div className="w-1/2 mt-1 pl-4 pr-4">
                      <Label htmlFor="endDate" className="text-right">End Date</Label>
                      <Input id="endDate" name="endDate" value={selectedLeaveRequest?.endDate || ''} disabled />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 mt-1 pl-4">
                      <Label htmlFor="reason" className="text-right">Contact No.</Label>
                      <Input id="reason" name="reason" value={selectedLeaveRequest?.reason || ''} disabled />
                    </div>
                    <div className="w-1/2 mt-1 pl-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                      <Input id="status" name="status" value={selectedLeaveRequest?.status || ''} disabled />
                    </div>
                    <div className="w-1/2 mt-1 pl-4 pr-4">
                      <Label htmlFor="approverRemarks" className="text-right">Approver Remarks</Label>
                      <Textarea className="h-40" id="approverRemarks" name="approverRemarks" value={selectedLeaveRequest?.approverRemarks || ''} disabled />
                    </div>
                  </div>
                  {/* <Image src={selectedTenants?.tenantImage || ''} alt="Property" width={400} height={400} className="mt-4 items-center justify-center flex flex-1"/> */}
                </div>
            </CardTitle>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export const columns: ColumnDef<ForApproval>[] = [
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
    accessorKey: "leaveType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Type" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
},
  {
    accessorKey: "approverRemarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approver Remarks" />
    ),
  },
  
  {
    id: "actions",
    cell: CellComponent, // Use the component you defined above
  },
]
