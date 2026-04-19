import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    
    const isAdmin = user?.roleName?.toLowerCase().includes('admin');
    
    if (isAdmin) {
        return <AdminDashboard />;
    }
    
    return <EmployeeDashboard />;
};
