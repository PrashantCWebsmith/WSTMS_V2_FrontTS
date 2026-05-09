import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import {
  useSMTPs,
  useDeleteSMTP,
  useUpdateSMTPStatus
} from '../hooks/queries/smtp.queries';
import { SMTPFormModal } from '../components/SMTPFormModal';
import type { SMTPListDto, SMTPCreateUpdateDto } from '../types/smtp.types';
import Swal from 'sweetalert2';
import { handleActionResult } from '@/utils/toast.utils';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Button } from '@/components/ui/button';
import { DataPagination } from '@/components/ui/DataPagination';

export const SMTPList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SMTPCreateUpdateDto>({
    smtpIDP: 0,
    smtp: '',
    portNo: 587,
    userName: '',
    enableSSL: true,
    status: true
  });

  const [appliedParams, setAppliedParams] = useState({
    pageNo: 1,
    pageSize: 10,
    searchValue: ''
  });

  const { data, isLoading, isError, refetch } = useSMTPs({ 
    pageNo: appliedParams.pageNo, 
    pageSize: appliedParams.pageSize, 
    searchValue: appliedParams.searchValue 
  });
  const deleteMutation = useDeleteSMTP();
  const statusMutation = useUpdateSMTPStatus();

  const handleOpenModal = (item?: SMTPListDto) => {
    if (item) {
      setFormData({
        smtpidp: item.smtpidp || 0,
        smtp: item.smtp,
        portNo: item.portNo,
        userName: item.userName,
        enableSSL: item.enableSSL,
        status: item.status
      });
    } else {
      setFormData({
        smtpidp: 0,
        smtp: '',
        portNo: 587,
        userName: '',
        enableSSL: true,
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
      text: "This configuration will be permanently deleted and system emails may fail.",
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
      text: "This will toggle the active state of this SMTP configuration.",
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

  const smtps: SMTPListDto[] = useMemo(() => {
    return data?.data || [];
  }, [data]);



  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <AlertCircle size={48} className="text-rose-500 mb-4 opacity-20" />
        <p className="text-lg font-bold">Failed to load SMTP settings</p>
        <Button variant="ghost" onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
      <PageHeader 
        title="SMTP Master"
        description="Manage system email servers and communication protocols"
        showBack={true}
        onBack={() => navigate('/settings')}
        action={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} className="mr-2" /> Add New SMTP
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
              placeholder="Search SMTP configurations..."
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

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full">
              <tbody className="bg-white divide-y divide-gray-200">
                <TableSkeleton columns={5} />
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Server Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Port</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">SSL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {smtps.length > 0 ? (
                  smtps.map((s: SMTPListDto) => (
                    <tr key={s.smtpidp} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenModal(s)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s.smtpidp)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{s.smtp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.portNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.enableSSL ? <span className="text-green-600 font-medium">Enabled</span> : <span className="text-gray-400">Disabled</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(s.smtpidp)}
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
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No SMTP configurations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <DataPagination
          totalItems={data?.totalCount || 0}
          pageSize={appliedParams.pageSize}
          currentPage={appliedParams.pageNo}
          onPageChange={(p) => setAppliedParams(prev => ({ ...prev, pageNo: p }))}
          onPageSizeChange={(s) => setAppliedParams(prev => ({ ...prev, pageSize: s, pageNo: 1 }))}
        />
      </div>

      <SMTPFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        smtpId={formData.smtpidp}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
