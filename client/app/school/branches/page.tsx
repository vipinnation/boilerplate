'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BranchList } from '@/components/branches/branch-list';
import { AddBranchDialog } from '@/components/branches/add-branch-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/table/data-table.component';
import { BranchesAPI } from '@/utils/api-calls/branches.api-calls';
import { Badge } from '@/components/ui/badge';

export default function BranchesPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    preloads();
  }, []);

  const preloads = async () => {
    try {
      setIsLoading(true);

      let res = await BranchesAPI.getBranch();
      console.log(res);
      setBranches(res.branches);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return <>{row.original && row.original.name ? row.original.name : null}</>;
      }
    },
    {
      accessorKey: 'principal',
      header: 'Principal Name',
      cell: ({ row }) => {
        return (
          <div>
            {row.original && row.original.principal ? (
              <>
                <p>Name: {row.original.principal.name} </p>
                <p>Mobile: {row.original.principal.contactNumber} </p>
                <p>Email: {row.original.principal.email} </p>
              </>
            ) : null}
          </div>
        );
      }
    },
    {
      accessorKey: 'code',
      header: 'Branch Code',
      cell: ({ row }) => {
        return <>{row.original && row.original.code ? row.original.code : null}</>;
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return <>{row.original && row.original.type ? row.original.type : null}</>;
      }
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => {
        return (
          <div>
            {row.original && row.original.address ? (
              <>
                <p>
                  {' '}
                  {row.original.address.street},{row.original.address.city}{' '}
                </p>
                <p>
                  {' '}
                  {row.original.address.state} , {row.original.address.country}{' '}
                </p>
                <p> {row.original.address.postalCode} </p>
              </>
            ) : null}
          </div>
        );
      }
    },
    {
      accessorKey: 'contacts',
      header: 'Contacts',
      cell: ({ row }) => {
        return (
          <div>
            {row.original && row.original.contact ? (
              <>
                <p>Mobile: {row.original.contact.phone} </p>
                <p>Email: {row.original.contact.email} </p>
              </>
            ) : null}
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return <>{row.original && row.original.status ? row.original.status : null}</>;
      }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return <Badge>Actions</Badge>;
      }
    }
  ];

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Branch
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={branches}
          isLoading={isLoading}
          placeholder={'Search Branch'}
          search_column="name"
        />
        {/* <BranchList /> */}
        <AddBranchDialog open={open} onOpenChange={setOpen} />
      </div>
    </>
  );
}
