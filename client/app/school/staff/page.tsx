'use client';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/data-table.component';
import { StaffAPI } from '@/utils/api-calls/staff.api-calls';
import AddEditStaffDrawer from '@/components/staff/add-edit-staff';
import { ColumnDef } from '@tanstack/react-table';
import { DeleteConfirmationModal } from "@/components/modals/delete-modal.component";
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [staffToBlock, setStaffToBlock] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const handleBlock = async (staff: any) => {
    setStaffToBlock(staff);
    setBlockModalOpen(true);
  };

  const confirmBlock = async () => {
    try {
      if (!staffToBlock) return;
      await StaffAPI.blockStaff(staffToBlock.id);
      setStaff(staff.map(s => 
        s.id === staffToBlock.id 
          ? { ...s, user: { ...s.user, isActive: !s.user.isActive } }
          : s
      ));
      setBlockModalOpen(false);
      setStaffToBlock(null);
      toast.success(`Staff member ${staffToBlock.user.isActive ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error('Error toggling staff status:', error);
      toast.error('Failed to update staff member status');
    }
  };

  const handleEdit = async (staff: any) => {
    try {
      setSelectedStaff(staff);
      setOpen(true);
    } catch (error) {
      console.error('Error editing staff:', error);
      toast.error('Failed to edit staff member');
    }
  };
  const handleDelete = async (id: string) => {
    setStaffToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!staffToDelete) return;
      await StaffAPI.deleteStaff(staffToDelete);
      setStaff(staff.filter(s => s.id !== staffToDelete));
      setDeleteModalOpen(false);
      setStaffToDelete(null);
      toast.success('Staff member removed successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error(typeof (error) === 'string' ? error : 'Failed to delete staff member. Please try again.');
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.user?.firstName || 'N/A'} {row.original.user?.lastName || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="">
          {row.original.user?.email || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.user?.phone || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.employeeId || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.department || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.position || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.user.isActive ? 'Active' : 'Inactive'}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
             Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleBlock(row.original)}
              className={row.original.user.isActive ? 'text-red-600' : 'text-green-600'}
            >
              {row.original.user.isActive ? 'Block' : 'Unblock'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await StaffAPI.getStaff();
      setStaff(response.staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);


  const onSuccess = (response: any) => {
    try {
      if (response && response.staff) {
        if (response.isUpdate) {
          setStaff(prev => prev.map(staff => 
            staff.id === response.staff.id ? response.staff : staff
          ));
        } else {
          setStaff(prev => [...prev, response.staff]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <AddEditStaffDrawer 
              onSuccess={onSuccess} 
              isOpen={open} 
              setIsOpen={setOpen}
              staffData={selectedStaff}
            />

          </div>
        </div>

        <div className="">

          <DataTable
            columns={columns}
            data={staff}
            placeholder="Search staff..."
            search_column="email"
            isLoading={isLoading}
          />

        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setStaffToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
      />
      <DeleteConfirmationModal
        isOpen={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false);
          setStaffToBlock(null);
        }}
        onConfirm={confirmBlock}
        title={`${staffToBlock?.user.isActive ? 'Block' : 'Unblock'} Staff Member`}
        description={`Are you sure you want to ${staffToBlock?.user.isActive ? 'block' : 'unblock'} this staff member?`}
      />
    </>
  );
}
