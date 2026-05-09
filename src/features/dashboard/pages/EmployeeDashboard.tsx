import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { TaskList } from '@/features/tasks/pages/TaskList';
import { useTimeTracking } from '@/providers/time-tracking-provider';
import {
    Activity,
    MessageCircle,
    Users,
    Calendar,
    Briefcase
} from 'lucide-react';

import { QuickTimerModal } from '@/features/tasks/components/QuickTimerModal';

export const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const { isRunning, formatTime, elapsedTime } = useTimeTracking();

    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
    const [activeActionType, setActiveActionType] = useState('');

    const handleQuickAction = (action: string) => {
        setActiveActionType(action);
        setIsTimerModalOpen(true);
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 w-full max-w-[1920px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Overview</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome, <span className="font-bold text-gray-700">{user?.userName} ({user?.roleName})</span>. Here is the overview of all tasks.
                    </p>
                </div>
                <div className="flex gap-3">
                    {isRunning && (
                        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-emerald-700">Active Pulse: {formatTime(elapsedTime)}</span>
                        </div>
                    )}
                    <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center">
                        <Briefcase size={16} className="mr-2 text-blue-600" />
                        Active Assignments
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT SIDE: Active Task Feed */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase size={20} className="text-gray-500" />
                                Assigned Tasks
                            </h3>
                        </div>
                        <TaskList hideHeader={true} />
                    </div>
                </div>

                {/* RIGHT SIDE: Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Start Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} />
                            Quick Actions
                        </h3>
                        <p className="text-blue-100 text-sm mb-6">
                            Start a new task instantly by selecting a category below.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleQuickAction('Internal Discussion')}
                                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-lg flex items-center gap-3 transition-all group backdrop-blur-sm"
                            >
                                <div className="bg-white/20 p-2 rounded-md group-hover:scale-110 transition-transform">
                                    <MessageCircle size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-semibold text-sm">Internal Sync</span>
                                    <span className="text-xs text-blue-100 opacity-80">Team logic planning</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleQuickAction('Client Call')}
                                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-lg flex items-center gap-3 transition-all group backdrop-blur-sm"
                            >
                                <div className="bg-white/20 p-2 rounded-md group-hover:scale-110 transition-transform">
                                    <Users size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-semibold text-sm">Client Connect</span>
                                    <span className="text-xs text-blue-100 opacity-80">Billed communication</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleQuickAction('Meeting')}
                                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-lg flex items-center gap-3 transition-all group backdrop-blur-sm"
                            >
                                <div className="bg-white/20 p-2 rounded-md group-hover:scale-110 transition-transform">
                                    <Calendar size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-semibold text-sm">Meeting</span>
                                    <span className="text-xs text-blue-100 opacity-80">General sync up</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Performance Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Performance</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Assignment Status</span>
                                <span className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full uppercase">Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <QuickTimerModal 
                isOpen={isTimerModalOpen} 
                onClose={() => setIsTimerModalOpen(false)} 
                actionType={activeActionType}
                onSaveSuccess={() => {}}
            />
        </div>
    );
};
