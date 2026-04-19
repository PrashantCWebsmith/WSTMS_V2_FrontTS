import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { cn } from '@/utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Basic check for screen size on mount
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // Default open on desktop (lg)
    }
    return true;
  });

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans relative">
      {/* Sidebar - Desktop */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out"
      >
        {/* Navbar */}
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth min-w-0">
          <div className="w-full">
            {children}
          </div>
        </main>

      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
