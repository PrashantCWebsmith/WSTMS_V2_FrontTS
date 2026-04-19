import React, { useState, useEffect } from 'react';
import { Menu, Search, User, LogOut, Lock, Clock } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [workingSeconds, setWorkingSeconds] = useState(0);

  // Timer logic to match V1
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkingSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">

      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center flex-1 gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-md hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search tasks, projects, users..."
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 lg:gap-6">

        {/* Working Timer Widget - Matches V1 */}
        {!['Super Admin', 'Admin', 'Administrator'].includes(user?.roleName || '') && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <Clock size={16} />
            <span className="text-sm font-semibold font-mono" title="Working Hours today">
              {formatTime(workingSeconds)}
            </span>
          </div>
        )}

        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 focus:outline-none group"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-gray-800 group-hover:text-blue-800 transition-colors">
                {(user?.userName || 'User')}
              </p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">
                {user?.roleName || 'Role'}
              </p>
            </div>
            <div className="h-10 w-10 min-w-[40px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white group-hover:ring-blue-100 transition-all uppercase">
              {user?.userName ? user.userName.substring(0, 2).toUpperCase() : 'JD'}
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-20 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.userName}
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{user?.roleName}</p>
                </div>

                <NavLink to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <User size={16} className="mr-3" /> Profile
                </NavLink>
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <Lock size={16} className="mr-3" /> Change Password
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-3" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
