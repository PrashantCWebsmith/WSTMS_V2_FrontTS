import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  X,
  Filter
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import {
  useLeaves,
  useDeleteLeave,
  useUpdateLeaveStatus
} from '../hooks/queries/leave.queries';
import { LeaveFormModal } from '../components/LeaveFormModal';
import type { LeaveListDto, LeaveCreateUpdateDto } from '../types/leave.types';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';

export const LeaveList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<LeaveCreateUpdateDto>({
    leaveIDP: 0,
    leaveName: '',
    leaveCode: '',
    isPaid: false,
    maxDaysPerYear: 0,
    description: '',
    status: true
  });

  const [appliedParams, setAppliedParams] = useState({
    pageNo: 1,
    pageSize: 10,
    searchValue: ''
  });

  const { data, isLoading, refetch } = useLeaves({ 
    pageNo: appliedParams.pageNo, 
    pageSize: appliedParams.pageSize, 
    searchValue: appliedParams.searchValue 
  });
  const deleteMutation = useDeleteLeave();
  const statusMutation = useUpdateLeaveStatus();

  const handleOpenModal = (item?: LeaveListDto) => {
    if (item) {
      setFormData({
        leaveIDP: item.leaveIDP,
        leaveName: item.leaveName,
        leaveCode: item.leaveCode,
        isPaid: item.isPaid,
        maxDaysPerYear: item.maxDaysPerYear,
        description: item.description,
        status: item.status
      });
    } else {
      setFormData({
        leaveIDP: 0,
        leaveName: '',
        leaveCode: '',
        isPaid: false,
        maxDaysPerYear: 0,
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

  const handleDelete = useCallback(async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This leave policy record will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await deleteMutation.mutateAsync(id);
      handleActionResult(res);
    }
  }, [deleteMutation]);

  const handleStatusToggle = useCallback(async (id: number) => {
    const result = await Swal.fire({
      title: 'Change status?',
      text: "This will toggle the active state of this leave type.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, toggle status'
    });

    if (result.isConfirmed) {
      const res = await statusMutation.mutateAsync(id);
      handleActionResult(res);
    }
  }, [statusMutation]);

  const leaves: LeaveListDto[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const totalItems = data?.totalCount || 0;

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
      <PageHeader 
        title="Leave Master"
        description="Monitor and manage employee attendance and leave requests"
        showBack={true}
        onBack={() => navigate('/settings')}
        action={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} className="mr-2" /> Add New Leave
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
              placeholder="Search leaves..."
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Leave Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Max Days</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={6} />
              ) : leaves.length > 0 ? (
                leaves.map((l: LeaveListDto) => (
                  <tr key={l.leaveIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(l)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(l.leaveIDP)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase shadow-sm border border-blue-100">
                            <Calendar size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{l.leaveName}</div>
                          <div className="text-xs text-gray-500">{l.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{l.leaveCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold rounded-full ${l.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {l.isPaid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{l.maxDaysPerYear}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        disabled={statusMutation.isPending}
                        onClick={() => handleStatusToggle(l.leaveIDP)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 ${l.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}>
                        {l.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {l.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No leave records found.</td>
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

      <LeaveFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leaveId={formData.leaveIDP}
        onSuccess={() => refetch()}
      />
    </div>
  );
};