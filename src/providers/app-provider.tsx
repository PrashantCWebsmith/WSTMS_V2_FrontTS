import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from './auth-provider';
import { TimeTrackingProvider } from './time-tracking-provider';
import { Toaster } from 'react-hot-toast';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TimeTrackingProvider>
            {children}
            <Toaster />
          </TimeTrackingProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
