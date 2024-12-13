import Header from '@/components/layout/header';
import SchoolSidebar from '@/components/layout/sidebar';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <React.Fragment>
      <Header />
      <div className="flex">
        <div className="w-[10rem] shadow-md bg-gray-100 fixed h-full z-20">
          <SchoolSidebar />
        </div>

        <div className="w-full min-h-[80vh] ml-[10rem] mt-16">{children}</div>
      </div>
    </React.Fragment>
  );
}
