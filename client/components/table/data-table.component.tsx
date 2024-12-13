'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RotateCw } from 'lucide-react';
import React, { useEffect } from 'react';
import InputField from '../forms/input-field';
import { TablePagination } from '../ui/table-pagination.component';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: any;
  placeholder?: string;
  search_column?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  placeholder,
  search_column
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    }
  });

  useEffect(() => {}, [data, isLoading]);

  return (
    <div className="rounded-md border w-full">
      <InputField
        type="text"
        name="fitler"
        placeholder={placeholder}
        value={(table.getColumn(search_column ? search_column : 'name')?.getFilterValue() as string) ?? ''}
        onChange={(event: any) =>
          table.getColumn(search_column ? search_column : 'name')?.setFilterValue(event.target.value)
        }
        className="max-w-sm px-2 sm:mx-2 sm:px-0 my-1"
      />
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="w-full">
          {!isLoading || isLoading == false ? (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No Result
                  </TableCell>
                </TableRow>
              )}
            </>
          ) : null}
        </TableBody>
      </Table>
      {isLoading == true ? (
        <div className="w-full flex justify-center py-4">
          <RotateCw className="animate-spin text-center" />
        </div>
      ) : null}
      <TablePagination table={table} />
    </div>
  );
}
