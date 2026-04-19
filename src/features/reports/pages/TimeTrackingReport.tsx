import React, { useState } from 'react';
import { Calendar, Filter, Search, X, FileText, Loader2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { toast } from '@/utils/toast.utils';

// Services & Hooks
import { useTimeTrackingReport } from '../hooks/queries/report.queries';
import type { TimeTrackingFilterModel } from '../types/report.types';
import { useProjects } from '@/features/projects/hooks/queries/project.queries';
import { useTaskTypes } from '@/features/task-type/hooks/queries/task-type.queries';
import { useUsers } from '@/features/users/hooks/queries/user.queries';
import { usePriorities } from '@/features/priority/hooks/queries/priority.queries';
import { useTaskStatuses } from '@/features/task-status/hooks/queries/task-status.queries';

export const TimeTrackingReport: React.FC = () => {
    // Selected Filters
    const [selectedProject, setSelectedProject] = useState<{ value: number, label: string } | null>(null);
    const [selectedTaskType, setSelectedTaskType] = useState<{ value: number, label: string } | null>(null);
    const [selectedAssignTo, setSelectedAssignTo] = useState<{ value: number, label: string } | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<{ value: number, label: string } | null>(null);
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<{ value: number, label: string } | null>(null);

    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());

    const [filterPayload, setFilterPayload] = useState<TimeTrackingFilterModel | null>(null);

    // React Query hook for analytical report fetching
    const { data: reportData = [], isLoading: loading } = useTimeTrackingReport(
        filterPayload || {
            projectIDF: 0,
            taskTypeIDF: 0,
            assignToIDF: 0,
            priorityIDF: 0,
            taskStatusIDF: 0,
            fromSystemDate: '',
            toSystemDate: ''
        },
        !!filterPayload
    );

    // Dropdown Data
    const { data: projectsRes } = useProjects({ page: 1, size: 1000 });
    const { data: taskTypesRes } = useTaskTypes({ page: 1, size: 1000 });
    const { data: usersRes } = useUsers({ page: 1, size: 1000 });
    const { data: prioritiesRes } = usePriorities({ page: 1, size: 1000 });
    const { data: taskStatusesRes } = useTaskStatuses({ page: 1, size: 1000 });

    const projects = (projectsRes?.data || []).map((p: any) => ({ value: p.projectIDP, label: p.projectName }));
    const taskTypes = (taskTypesRes?.data || []).map((t: any) => ({ value: t.taskTypeIDP, label: t.taskType }));
    const users = (usersRes?.data || []).map((u: any) => ({ value: u.userIDP, label: u.userFullName }));
    const priorities = (prioritiesRes?.data || []).map((p: any) => ({ value: p.priorityIDP, label: p.priorityName }));
    const taskStatuses = (taskStatusesRes?.data || []).map((s: any) => ({ value: s.taskStatusIDP, label: s.taskStatus }));

    const handleSearch = () => {
        const payload: TimeTrackingFilterModel = {
            projectIDF: selectedProject?.value || 0,
            taskTypeIDF: selectedTaskType?.value || 0,
            assignToIDF: selectedAssignTo?.value || 0,
            priorityIDF: selectedPriority?.value || 0,
            taskStatusIDF: selectedTaskStatus?.value || 0,
            fromSystemDate: fromDate ? fromDate.toISOString() : new Date().toISOString(),
            toSystemDate: toDate ? toDate.toISOString() : new Date().toISOString()
        };
        setFilterPayload(payload);
    };

    const handleReset = () => {
        setSelectedProject(null);
        setSelectedTaskType(null);
        setSelectedAssignTo(null);
        setSelectedPriority(null);
        setSelectedTaskStatus(null);
        setFromDate(new Date());
        setToDate(new Date());
        setFilterPayload(null);
    };

    const formatSecondsToHHMM = (seconds: number) => {
        if (!seconds) return "00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="p-6 space-y-6 w-full overflow-hidden">
            {/* Header Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Time Tracking Report</h1>
                        <p className="text-xs font-medium text-gray-500">Generate and analyze effort distribution</p>
                    </div>
                </div>
            </div>

            {/* Filters Configuration Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold border-b border-gray-50 pb-3">
                    <Filter size={16} className="text-blue-600" />
                    <span className="text-sm">Filter Configuration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                    <SearchableSelect
                        placeholder="Project"
                        options={projects}
                        value={selectedProject?.value || 0}
                        onChange={(val) => {
                            const opt = projects.find(p => p.value === Number(val));
                            setSelectedProject(opt ? (opt as any) : null);
                        }}
                    />
                    <SearchableSelect
                        placeholder="Task Type"
                        options={taskTypes}
                        value={selectedTaskType?.value || 0}
                        onChange={(val) => {
                            const opt = taskTypes.find(t => t.value === Number(val));
                            setSelectedTaskType(opt ? (opt as any) : null);
                        }}
                    />
                    <SearchableSelect
                        placeholder="Assigned To"
                        options={users}
                        value={selectedAssignTo?.value || 0}
                        onChange={(val) => {
                            const opt = users.find(u => u.value === Number(val));
                            setSelectedAssignTo(opt ? (opt as any) : null);
                        }}
                    />
                    <SearchableSelect
                        placeholder="Status"
                        options={taskStatuses}
                        value={selectedTaskStatus?.value || 0}
                        onChange={(val) => {
                            const opt = taskStatuses.find(s => s.value === Number(val));
                            setSelectedTaskStatus(opt ? (opt as any) : null);
                        }}
                    />
                    <SearchableSelect
                        placeholder="Priority"
                        options={priorities}
                        value={selectedPriority?.value || 0}
                        onChange={(val) => {
                            const opt = priorities.find(p => p.value === Number(val));
                            setSelectedPriority(opt ? (opt as any) : null);
                        }}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">From:</span>
                        <div className="relative">
                            <DatePicker
                                selected={fromDate}
                                onChange={(date: Date | null) => setFromDate(date)}
                                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none w-32"
                                dateFormat="dd-MM-yyyy"
                            />
                            <Calendar className="absolute left-2.5 top-2 text-gray-400" size={12} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">To:</span>
                        <div className="relative">
                            <DatePicker
                                selected={toDate}
                                onChange={(date: Date | null) => setToDate(date)}
                                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none w-32"
                                dateFormat="dd-MM-yyyy"
                            />
                            <Calendar className="absolute left-2.5 top-2 text-gray-400" size={12} />
                        </div>
                    </div>

                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={handleReset}
                            className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">Task Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Context</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Assignment</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Timeline</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Hours</th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <TableSkeleton columns={7} />
                            ) : reportData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                                        <Search size={32} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-medium text-sm italic">No records matching active criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((item, index) => (
                                    <tr key={item.taskIDP || index} className="border-b border-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 mb-0.5">{item.taskTitle}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.taskNo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-700 truncate max-w-[150px] mb-1">{item.projectName}</div>
                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded border border-gray-200 uppercase">{item.taskType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-gray-900 mb-0.5">{item.assignToName}</div>
                                            <div className="text-[10px] text-gray-400">By: {item.assignByName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase mb-1">
                                                {item.taskStatus}
                                            </span>
                                            <div className="text-[10px] text-gray-400 font-bold">PRI: {item.priorityIDF}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            <div className="mb-0.5">Start: <span className="text-gray-900 font-bold">{formatDate(item.startDate || '')}</span></div>
                                            <div>Dead: <span className="text-rose-600 font-bold">{formatDate(item.deadlineDate || '')}</span></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">Est: {formatSecondsToHHMM(item.estimatedHoursInSeconds || 0)}</div>
                                            <div className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs inline-block">Act: {formatSecondsToHHMM(item.actualHoursSeconds || 0)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                                {item.progressPercent}%
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
