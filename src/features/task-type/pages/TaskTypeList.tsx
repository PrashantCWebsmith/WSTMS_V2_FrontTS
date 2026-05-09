import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Layers
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import {
  useTaskTypes,
  useUpdateTaskTypeActive,
  useDeleteTaskType
} from '../hooks/queries/task-type.queries';
import { TaskTypeFormModal } from '../components/TaskTypeFormModal';
import type { TaskTypeListDto, TaskTypeCreateUpdateDto } from '../types/task-type.types';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export const TaskTypeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskTypeCreateUpdateDto>({
    taskTypeIDP: 0,
    taskType: '',
    description: '',
    status: true
  });

  const [appliedParams, setAppliedParams] = useState({
    pageNo: 1,
    pageSize: 10,
    searchValue: ''
  });

  const { data, isLoading, refetch } = useTaskTypes({ 
    pageNo: appliedParams.pageNo, 
    pageSize: appliedParams.pageSize, 
    searchValue: appliedParams.searchValue 
  });
  const activeMutation = useUpdateTaskTypeActive();
  const deleteMutation = useDeleteTaskType();

  const handleOpenModal = (item?: TaskTypeListDto) => {
    if (item) {
      setFormData({
        taskTypeIDP: item.taskTypeIDP,
        taskType: item.taskType,
        description: item.description || '',
        status: item.status
      });
    } else {
      setFormData({
        taskTypeIDP: 0,
        taskType: '',
        description: '',
        status: true
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
      text: `Do you want to ${action} this task type?`,
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

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This record will be permanently deleted.",
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

  const taskTypes = data?.data || [];
  const totalItems = data?.totalCount || 0;

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
      <PageHeader 
        title="Task Type Master"
        description="Categorize and define operational activity classifications"
        showBack={true}
        onBack={() => navigate('/settings')}
        action={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} className="mr-2" /> Add New Type
          </button>
        }
      />

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filters Section */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search task types..."
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Task Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={4} />
              ) : taskTypes.length > 0 ? (
                taskTypes.map((t: TaskTypeListDto) => (
                  <tr key={t.taskTypeIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(t)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.taskTypeIDP)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase shadow-sm border border-blue-100">
                            <Layers size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{t.taskType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate" title={t.description}>
                      {t.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        disabled={activeMutation.isPending}
                        onClick={() => handleStatusToggle(t.taskTypeIDP, t.status)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 ${t.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}>
                        {t.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {t.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No task types found.</td>
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

      <TaskTypeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        taskTypeId={formData.taskTypeIDP}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
