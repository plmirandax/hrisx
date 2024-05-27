"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { UploadPayslipForm } from "../../_components/payslip-upload"
import { useCurrentUser } from "@/hooks/use-current-user"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const user = useCurrentUser();

  const isAdmin = user?.role === 'Administrator';
  const isUser = user?.role === 'User';
  const isApprover = user?.role === 'Approver'
  const isPMD = user?.role === 'PMD';

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
      {(isAdmin || isPMD) && (
        <UploadPayslipForm />
      )}
        <Input
          placeholder="Filter payslips..."
          value={(table.getColumn("months")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("months")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
