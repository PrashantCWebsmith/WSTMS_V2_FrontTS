import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ListChecks,
  CheckCircle,
  XCircle,
  LayoutGrid,
  X
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import {
  useTaskStatuses,
  useUpdateTaskStatusActive,
  useUpdateKanbanVisibility,
  useDeleteTaskStatus
} from '../hooks/queries/task-status.queries';
import { TaskStatusFormModal } from '../components/TaskStatusFormModal';
import type { TaskStatusListDto, TaskStatusCreateUpdateDto } from '../types/task-status.types';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';

export const TaskStatusList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskStatusCreateUpdateDto>({
    taskStatusIDP: 0,
    taskStatus: '',
    description: '',
    sortOrder: 0,
    status: true,
    isDisplayInKanban: true
  });

  const [appliedParams, setAppliedParams] = useState({
    pageNo: 1,
    pageSize: 10,
    searchValue: ''
  });

  const { data, isLoading, refetch } = useTaskStatuses({ 
    pageNo: appliedParams.pageNo, 
    pageSize: appliedParams.pageSize, 
    searchValue: appliedParams.searchValue 
  });
  const activeMutation = useUpdateTaskStatusActive();
  const kanbanMutation = useUpdateKanbanVisibility();
  const deleteMutation = useDeleteTaskStatus();

  const handleOpenModal = (item?: TaskStatusListDto) => {
    if (item) {
      setFormData({
        taskStatusIDP: item.taskStatusIDP,
        taskStatus: item.taskStatus,
        description: item.description || '',
        sortOrder: item.sortOrder,
        status: item.status,
        isDisplayInKanban: item.isDisplayInKanban
      });
    } else {
      setFormData({
        taskStatusIDP: 0,
        taskStatus: '',
        description: '',
        sortOrder: 0,
        status: true,
        isDisplayInKanban: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setAppliedParams(prev => ({
      ...prev,
      searchValue: searchTerm,
      pageNo: 1
    }));
  };

  const handleClear = () => {
    setSearchTerm('');
    setAppliedParams({
      pageNo: 1,
      pageSize: appliedParams.pageSize,
      searchValue: ''
    });
  };

  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this workflow status?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      const res = await activeMutation.mutateAsync(id);
      handleActionResult(res);
    }
  };

  const handleKanbanToggle = async (id: number, currentKanbanVisibility: boolean) => {
    const action = currentKanbanVisibility ? "hide" : "show";
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this status in Kanban?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      const res = await kanbanMutation.mutateAsync(id);
      handleActionResult(res);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This status will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await deleteMutation.mutateAsync(id);
      handleActionResult(res);
    }
  };

  const taskStatuses = data?.data || [];
  const totalItems = data?.totalCount || 0;

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
      <PageHeader 
        title="Task Status Master"
        description="Standardize task lifecycle stages and workflow transition states"
        showBack={true}
        onBack={() => navigate('/settings')}
        action={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} className="mr-2" /> Add New Status
          </button>
        }
      />

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col animate-fadeIn">
        {/* Filters Section */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search task statuses..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
              title="Filter"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={handleClear}
              className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              title="Clear"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Sort Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Kanban</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={6} />
              ) : taskStatuses.length > 0 ? (
                taskStatuses.map((s: TaskStatusListDto) => (
                  <tr key={s.taskStatusIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(s)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(s.taskStatusIDP)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                          <ListChecks size={20} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{s.taskStatus}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-[200px] truncate" title={s.description || ''}>
                        {s.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.sortOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleKanbanToggle(s.taskStatusIDP, s.isDisplayInKanban)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${s.isDisplayInKanban
                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                        <LayoutGrid size={12} />
                        {s.isDisplayInKanban ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        disabled={activeMutation.isPending}
                        onClick={() => handleStatusToggle(s.taskStatusIDP, s.status)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${s.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}>
                        {s.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {s.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No statuses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DataPagination
          totalItems={totalItems}
          pageSize={appliedParams.pageSize}
          currentPage={appliedParams.pageNo}
          onPageChange={(p) => setAppliedParams(prev => ({ ...prev, pageNo: p }))}
          onPageSizeChange={(s) => setAppliedParams(prev => ({ ...prev, pageSize: s, pageNo: 1 }))}
        />
      </div>

      <TaskStatusFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        statusId={formData.taskStatusIDP}
        onSuccess={() => refetch()}
      />
    </div>
  );
};