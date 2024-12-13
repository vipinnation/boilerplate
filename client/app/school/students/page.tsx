'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddStudentDialog } from '@/components/students/add-student-dialog';
import { DataTable } from '@/components/table/data-table.component';
import { StudentsAPI } from '@/utils/api-calls/students.api-calls';

export default function StudentsPage() {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await StudentsAPI.getStudents();
      setStudents(response.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Phone'
    },
    {
      accessorKey: 'status',
      header: 'Status'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
          <Button
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        placeholder="Search students..."
        search_column="name"
        isLoading={isLoading}
      />

      <AddStudentDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
