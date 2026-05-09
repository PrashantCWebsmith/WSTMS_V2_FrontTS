import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldAlert,
  Filter,
  X
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import {
  useIncidents,
  useDeleteIncident
} from '../hooks/queries/incident.queries';
import { IncidentFormModal } from '../components/IncidentFormModal';
import type { IncidentListDto, IncidentCreateUpdateDto } from '../types/incident.types';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<IncidentCreateUpdateDto>({
    incidentidp: 0,
    projectIDF: 0,
    userIDF: 0,
    status: 'Open',
    incidentDate: new Date().toISOString()
  });

  const [appliedParams, setAppliedParams] = useState({
    pageNo: 1,
    pageSize: 10,
    searchValue: ''
  });

  const { data, isLoading, refetch } = useIncidents({ 
    pageNo: appliedParams.pageNo, 
    pageSize: appliedParams.pageSize, 
    searchValue: appliedParams.searchValue 
  });
  const deleteMutation = useDeleteIncident();

  const handleOpenModal = (item?: IncidentListDto) => {
    if (item) {
      setFormData({
        incidentidp: item.incidentidp,
        projectIDF: 0, // Will be fetched by modal
        userIDF: 0,    // Will be fetched by modal
        status: item.status,
        incidentDate: item.incidentDate
      });
    } else {
      setFormData({
        incidentidp: 0,
        projectIDF: 0,
        userIDF: 0,
        status: 'Open',
        incidentDate: new Date().toISOString()
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
      title: 'Delete this record?',
      text: "This removal is permanent and cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete incident'
    });

    if (result.isConfirmed) {
      const res = await deleteMutation.mutateAsync(id);
      handleActionResult(res);
    }
  }, [deleteMutation]);

  const incidents: IncidentListDto[] = data?.data || [];
  const totalItems = data?.totalCount || 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
      <PageHeader 
        title="Incident Master"
        description="Comprehensive tracking and management of project anomalies and critical incidents"
        action={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} className="mr-2" /> Report Incident
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
              placeholder="Search incidents..."
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
                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Incident Details</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Project</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <TableSkeleton columns={6} />
              ) : incidents.length > 0 ? (
                incidents.map((i: IncidentListDto) => (
                  <tr key={i.incidentidp} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(i)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(i.incidentidp)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold uppercase shadow-sm border border-blue-100">
                          <ShieldAlert size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {i.criticalPoint?.replace(/<[^>]+>/g, '') || 'No details'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i.projectName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(i.severity)}`}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(i.incidentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${i.status === 'Resolved' || i.status === 'Closed' ? 'bg-blue-100 text-blue-700' :
                        i.status === 'Open' ? 'bg-orange-100 text-orange-700' :
                        i.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {i.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No incidents identified.</td>
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

      <IncidentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        incidentId={formData.incidentidp}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
