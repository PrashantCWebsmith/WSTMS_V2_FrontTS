import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Search, 
    Filter, 
    LayoutGrid, 
    List, 
    X,
    Edit2,
    Trash2,
    Calendar,
    Eye,
    RefreshCw,
    MessageSquare,
    Briefcase
} from 'lucide-react';
import Select from 'react-select';
import { KanbanBoard } from './KanbanBoard';
import { DataPagination } from '@/components/ui/DataPagination';
import { useTasks, useDeleteTask, useTaskLookups } from '../hooks/queries/task.queries';
import { useTimeTracking } from '@/providers/time-tracking-provider';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskStatusModal } from '../components/TaskStatusModal';
import { TaskCommentModal } from '../components/TaskCommentModal';
import { TaskDocumentModal } from '../components/TaskDocumentModal';
import type { TaskListDto, TaskPagingFilterDto } from '../types/task.types';

interface TaskListProps {
    hideHeader?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ hideHeader = false }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [pageSize, setPageSize] = useState(10);

    // Draft filters (bound to inputs, not yet applied)
    const [draftFilters, setDraftFilters] = useState<Omit<TaskPagingFilterDto, 'pageNo' | 'pageSize'>>({
        projectIDF: 0,
        assignToIDF: 0,
        taskStatusIDF: 0,
        searchValue: ''
    });

    // Applied filters + page (these drive the actual query key)
    const [appliedParams, setAppliedParams] = useState<TaskPagingFilterDto>({
        pageNo: 1,
        pageSize: 10,
        projectIDF: 0,
        assignToIDF: 0,
        taskStatusIDF: 0,
        searchValue: ''
    });

    const { data, isLoading, refetch } = useTasks(appliedParams);
    const { data: lookups } = useTaskLookups();
    const deleteMutation = useDeleteTask();
    const { startTimer, stopTimer } = useTimeTracking();

    // Modal States
    const [selectedTask, setSelectedTask] = useState<TaskListDto | null>(null);
    const [selectedTaskID, setSelectedTaskID] = useState<number | undefined>(undefined);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    const handleOpenFormModal = (task?: TaskListDto) => {
        setSelectedTaskID(task?.taskIDP);
        setIsFormModalOpen(true);
    };

    const handleOpenStatusModal = (task: TaskListDto) => {
        setSelectedTask(task);
        setIsStatusModalOpen(true);
    };

    const handleOpenCommentModal = (task: TaskListDto) => {
        setSelectedTask(task);
        setIsCommentModalOpen(true);
    };

    // Update draft filter selects
    const handleFilterSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name as keyof Omit<TaskPagingFilterDto, 'pageNo' | 'pageSize'>;
        const value = selectedOption ? selectedOption.value : 0;
        setDraftFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply draft filters → commit to query key (resets to page 1)
    const handleSearch = useCallback(() => {
        setAppliedParams(prev => ({
            ...prev,
            ...draftFilters,
            pageNo: 1,
            pageSize
        }));
    }, [draftFilters, pageSize]);

    // Clear drafts and reset query to default
    const handleClearFilters = useCallback(() => {
        const empty = { projectIDF: 0, assignToIDF: 0, taskStatusIDF: 0, searchValue: '' };
        setDraftFilters(empty);
        setAppliedParams({ ...empty, pageNo: 1, pageSize });
    }, [pageSize]);

    // Navigate to a specific page
    const handlePageChange = useCallback((newPage: number) => {
        setAppliedParams(prev => ({ ...prev, pageNo: newPage }));
    }, []);

    // Change page size and reset to page 1
    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setAppliedParams(prev => ({ ...prev, pageSize: newSize, pageNo: 1 }));
    }, []);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success('Task has been deleted.');
            } catch (error) {
                toast.error('Failed to delete Task');
            }
        }
    };

    // Styling Helpers
    const getInitials = (name?: string) => {
        if (!name || name === 'Unassigned' || name === 'Unknown') return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-700';
            case 'medium': return 'bg-amber-50 text-amber-700';
            case 'low': return 'bg-green-50 text-green-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };
    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-50 text-green-700';
            case 'in progress': return 'bg-blue-50 text-blue-700';
            case 'closed': return 'bg-blue-100 text-blue-800';
            case 'on hold': return 'bg-amber-50 text-amber-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };
    const getTypeColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'meeting': return 'bg-gray-50 text-gray-600 border-gray-100';
            case 'bug': return 'bg-red-50 text-red-600 border-red-100';
            case 'feature': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    // Select Options
    const projectOptions = [
        { value: 0, label: 'All Projects' },
        ...(lookups?.projects.map((p: any) => ({ value: p.projectIDP || p.id, label: p.projectName })) || [])
    ];
    const userOptions = [
        { value: 0, label: 'All Users' },
        ...(lookups?.users.map((u: any) => ({ value: u.userIDP || u.id, label: u.userFullName || u.userName })) || [])
    ];
    const statusOptions = [
        { value: 0, label: 'All Statuses' },
        ...(lookups?.statuses.map((s: any) => ({ value: s.taskStatusIDP || s.id, label: s.taskStatus })) || [])
    ];

    const tasks = data?.data || [];
    const totalItems = data?.totalCount || 0;

    const handleKanbanStatusChange = async (task: TaskListDto, _oldStatusId: number, newStatusId: number) => {
        handleOpenStatusModal({ ...task, taskStatusIDF: newStatusId });
    };

    return (
        <div className="p-6 space-y-6 w-full overflow-hidden">
            {!hideHeader && (
                <>
                    {/* Header Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">Task Master</h1>
                            <p className="text-sm font-medium text-gray-400 mt-0.5">Track and manage operational workflows and project objectives</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center shadow-sm">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="List View"
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => { setViewMode('kanban'); handlePageSizeChange(100); }}
                                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="Kanban Board"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                            </div>
                            <button
                                onClick={() => handleOpenFormModal()}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                            >
                                <Plus size={18} className="mr-2" /> New Task
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Main Content Card (Table or Kanban) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Filters Section */}
                <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm"
                            value={draftFilters.searchValue}
                            onChange={(e) => setDraftFilters(prev => ({ ...prev, searchValue: e.target.value }))}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Select
                            name="projectIDF"
                            value={projectOptions.find(o => o.value === draftFilters.projectIDF)}
                            onChange={handleFilterSelectChange}
                            options={projectOptions}
                            placeholder="Select Project"
                            className="text-sm"
                            isSearchable
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Select
                            name="assignToIDF"
                            value={userOptions.find(o => o.value === draftFilters.assignToIDF)}
                            onChange={handleFilterSelectChange}
                            options={userOptions}
                            placeholder="Select User"
                            className="text-sm"
                            isSearchable
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Select
                            name="taskStatusIDF"
                            value={statusOptions.find(o => o.value === draftFilters.taskStatusIDF)}
                            onChange={handleFilterSelectChange}
                            options={statusOptions}
                            placeholder="Select Status"
                            className="text-sm"
                            isSearchable
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                        <button
                            onClick={handleSearch}
                            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                            title="Filter"
                        >
                            <Filter size={20} />
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                            title="Clear"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-[#f8fafc]">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Task Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Context</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Assignment</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <TableSkeleton columns={5} rows={8} />
                            </tbody>
                        </table>
                    </div>
                ) : viewMode === 'kanban' ? (
                    <KanbanBoard
                        tasks={tasks}
                        statuses={lookups?.statuses || []}
                        onStatusChange={handleKanbanStatusChange}
                        onTaskClick={(t) => handleOpenFormModal(t)}
                    />
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-[#f8fafc]">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Task Info</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Context</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Assignment</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {tasks.length > 0 ? (
                                        tasks.map((task: TaskListDto) => {
                                            const isEditDelete = !!task.isEditDelete;

                                            return (
                                                <tr key={task.taskIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {task.timerStatus ? (
                                                                <button
                                                                    onClick={() => stopTimer()}
                                                                    className="p-2 bg-rose-600 text-white rounded-lg shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer animate-pulse"
                                                                    title="Stop Timer"
                                                                >
                                                                    <div className="w-3.5 h-3.5 bg-white rounded-sm"></div>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => startTimer(task)}
                                                                    className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer"
                                                                    title="Start Timer"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

                                                            <button
                                                                onClick={() => handleOpenStatusModal(task)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                                title="Change Status"
                                                            >
                                                                <RefreshCw size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenCommentModal(task)}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                                                title="Add Comment"
                                                            >
                                                                <MessageSquare size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => window.open(`/tasks/${task.taskIDP}/details`, '_blank')}
                                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                                                                title="View Details"
                                                            >
                                                                <Eye size={15} />
                                                            </button>

                                                            {isEditDelete && (
                                                                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-gray-100">
                                                                    <button
                                                                        onClick={() => handleOpenFormModal(task)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 size={15} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(task.taskIDP)}
                                                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={15} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-900 mb-1" title={task.taskTitle}>
                                                            {task.taskTitle}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-gray-400">{task.taskNo}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 truncate max-w-[200px] mb-2" title={task.projectName}>
                                                            <Briefcase size={14} className="text-gray-400 shrink-0" />
                                                            {task.projectName}
                                                            {task.projectCode && <span className="text-[10px] text-gray-400 font-bold">({task.projectCode})</span>}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeColor(task.taskType)} shadow-sm`}>
                                                                {task.taskType}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(task.taskStatus)} shadow-sm`}>
                                                                {task.taskStatus}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(task.priorityName)} shadow-sm`}>
                                                                {task.priorityName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[11px] font-black shrink-0 shadow-sm border border-blue-200">
                                                                {getInitials(task.assignTo)}
                                                            </div>
                                                            <div className="text-xs font-bold text-gray-800">{task.assignTo || '-'}</div>
                                                        </div>
                                                        {task.assignBy && (
                                                            <div className="flex items-center gap-1.5 ml-0.5 opacity-60">
                                                                <span className="text-[8px] text-gray-400 font-bold uppercase">By</span>
                                                                <div className="h-4 w-4 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-[8px] font-black shrink-0 border border-gray-200">
                                                                    {getInitials(task.assignBy)}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 font-medium">{task.assignBy}</div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                            <Calendar size={14} className="text-blue-500" />
                                                            {formatDate(task.deadlineDate)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                                        <Filter size={32} />
                                                    </div>
                                                    <p className="font-bold text-sm">No tasks identified in current view.</p>
                                                    <p className="text-xs mt-1">Try adjusting your project or assignee filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <DataPagination
                            totalItems={totalItems}
                            pageSize={appliedParams.pageSize}
                            currentPage={appliedParams.pageNo}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                )}

                {/* Modals */}
                <TaskFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    taskId={selectedTaskID}
                    onSuccess={() => refetch()}
                />

                {selectedTask && (
                    <>
                        <TaskStatusModal
                            isOpen={isStatusModalOpen}
                            onClose={() => setIsStatusModalOpen(false)}
                            task={selectedTask}
                            onStatusChangeSuccess={() => refetch()}
                        />
                        <TaskCommentModal
                            isOpen={isCommentModalOpen}
                            onClose={() => setIsCommentModalOpen(false)}
                            taskId={selectedTask.taskIDP}
                            taskNo={selectedTask.taskNo}
                            onCommentSuccess={() => refetch()}
                        />
                        <TaskDocumentModal
                            isOpen={isDocumentModalOpen}
                            onClose={() => setIsDocumentModalOpen(false)}
                            taskId={selectedTask.taskIDP}
                            taskNo={selectedTask.taskNo}
                            onUploadSuccess={() => refetch()}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
