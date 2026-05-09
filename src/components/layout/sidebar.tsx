import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Clock,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  Calendar,
  LogOut,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', end: true },
  { icon: Briefcase, label: 'Projects', path: '/projects', relatedPaths: ['/projects/new', '/projects/'] },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', relatedPaths: ['/tasks/'] },
  { icon: Calendar, label: 'Leave', path: '/leave' },
  { icon: ShieldAlert, label: 'Incidents', path: '/incidents' },
  { icon: Users, label: 'Users', path: '/users', roles: ['Super Admin', 'Admin'], relatedPaths: ['/users/'] },
  { icon: Clock, label: 'Time Tracking', path: '/reports/time-tracking' },
  { icon: FileText, label: 'Reports', path: '/reports', end: true },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['Super Admin', 'Admin'], relatedPaths: ['/task-status', '/task-type', '/priority', '/smtp', '/scheduler'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    if (user?.roleName === 'Super Admin') return true;
    return item.roles.includes(user?.roleName || '');
  });

  return (
    <aside
      className={cn(
        "fixed lg:relative left-0 top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out z-40 flex flex-col border-r border-slate-700 shadow-2xl lg:shadow-none",
        isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-700">
        {isOpen && (
          <span className="text-xl font-bold text-white tracking-wider animate-in fade-in duration-500">
            Websmith TMS
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
            !isOpen && "mx-auto"
          )}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredMenuItems.map((item) => {
          const isRelatedActive = item.relatedPaths?.some(path => location.pathname.startsWith(path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => {
                  const reallyActive = isActive || isRelatedActive;
                  return cn(
                    "group relative flex items-center px-4 py-3 rounded-lg transition-colors",
                    reallyActive
                      ? "bg-blue-600 text-white shadow-md font-medium"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  );
              }}
            >
              {({ isActive }) => {
                const reallyActive = isActive || isRelatedActive;
                return (
                  <>
                    <item.icon
                      size={20}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        reallyActive ? "text-white" : "group-hover:text-blue-400"
                      )}
                    />
                    {isOpen && (
                      <span className="ml-3 truncate font-medium animate-in fade-in slide-in-from-left-1">
                        {item.label}
                      </span>
                    )}
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className={cn("flex items-center", isOpen ? "justify-start" : "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.userName ? user.userName.substring(0, 2).toUpperCase() : 'JD'}
          </div>
          {isOpen && (
            <div className="ml-3 min-w-0 flex-1 group relative">
              <p className="text-sm font-medium text-white truncate leading-tight">{user?.userName || 'User'}</p>
              <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{user?.roleName || 'Role'}</p>
            </div>
          )}
          {isOpen && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors ml-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
