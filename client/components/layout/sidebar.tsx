'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/school'
  },
  {
    label: 'Branches',
    icon: Building2,
    href: '/school/branches'
  },
  {
    label: 'Students',
    icon: GraduationCap,
    href: '/school/students'
  },
  {
    label: 'Staff',
    icon: Users,
    href: '/school/staff'
  },
  {
    label: 'Classes',
    icon: Calendar,
    href: '/school/classes'
  },
  {
    label: 'Reports',
    icon: FileSpreadsheet,
    href: '/school/reports'
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    href: '/school/messages'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/school/settings'
  }
];

const SchoolSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="py-4 flex flex-col h-full bg-secondary/10 mt-16">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${pathname === route.href ? 'bg-secondary' : null}`}
            >
              <Link href={route.href} className="flex">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolSidebar;
