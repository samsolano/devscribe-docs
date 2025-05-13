"use client"

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
// import DashboardSidebar from './DashboardSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Determine which pages should show a sidebar and which ones dont
  const showSidebar = pathname !== '/edit';
  const isApiRelatedPage = pathname === '/api-marketplace' || 
    pathname === '/api-deepsearch' || 
    pathname.startsWith('/api-docs/');
  
  // Choose the appropriate sidebar
  // const SidebarComponent = isApiRelatedPage ? APISidebar : Sidebar;
  const SidebarComponent = Sidebar

  return (
    <div>
      {/* <Navbar /> */}
      {/* {!showSidebar && <Navbar />} */}
      <div className="flex">
        {showSidebar && <SidebarComponent />}
        <main className={`${showSidebar ? 'ml-64' : 'w-full'} flex-1 min-h-[calc(100vh-4rem) transition-all duration-200 `}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
