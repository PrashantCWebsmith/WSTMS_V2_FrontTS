import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-50" />

      <div className="z-10 w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 text-left space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Enterprise Task Management</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Manage your <span className="text-blue-600">projects</span> with confidence.
          </h1>
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            Websmith TMS provides a seamless experience for team collaboration, time tracking, and task management.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">10k+</h3>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">99.9%</h3>
              <p className="text-sm text-gray-500 font-medium">Uptime Reliable</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-medium">
        © 2026 Websmith Solution • Built with <span className="text-red-500">♥</span> for Productivity
      </div>
    </div>
  );
};
