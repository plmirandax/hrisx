"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import {  useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Payslips } from "../data/schema";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type RowData = Row<Payslips>;
const CellComponent = ({ row }: { row: RowData }) => {
  const payslipsx = row.original;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslips | null>(null);

  const handleOpenModal = () => {
    setSelectedPayslip(payslipsx);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPayslip(null);
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
              View Payslip Details
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex justify-center items-center z-50">
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[950px]">
            <CardTitle className="mb-8">Payslip Details</CardTitle>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <div>
                <Label className="font-semibold">Name</Label>
                      <Input
                        value={`${selectedPayslip?.user.firstName || ''} ${selectedPayslip?.user.lastName || ''}`}
                        readOnly
                      />
                </div>
              </div>

              <div className="w-1/2">
              <Label className="font-semibold">Month</Label>
              <Label className="font-semibold">Period</Label>
                        <Input value={selectedPayslip?.months} readOnly />
              </div>
              <div className="w-1/2">
              <Label className="font-semibold">Period</Label>
                        <Input value={selectedPayslip?.periods} readOnly />
              </div>
            </div>
            <Image src={selectedPayslip?.payslipFile || ''} alt="Payslip" width={1200} height={1200} className="mt-4 items-center justify-center flex flex-1"/>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export const columns: ColumnDef<Payslips>[] = [
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
    accessorKey: "months",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
  },
  {
    accessorKey: "periods",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period" />
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
