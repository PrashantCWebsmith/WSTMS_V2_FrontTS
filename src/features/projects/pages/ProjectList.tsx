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
    X
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { useProjects, useDeleteProject, useUpdateProjectStatus } from '../hooks/queries/project.queries';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';
import type { ProjectDto, ProjectCreateUpdateDto } from '../types/project.types';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ProjectFormModal } from '../components/ProjectFormModal';

export const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectCreateUpdateDto>({
        projectIDP: 0,
        projectName: '',
        status: true,
        projectCode: '',
        ownerDetails: '',
        websiteCredential: '',
        contactPerson: ''
    });

    const [appliedParams, setAppliedParams] = useState({
        pageNo: 1,
        pageSize: 10,
        searchValue: ''
    });

    const { data, isLoading, refetch } = useProjects({ 
        pageNo: appliedParams.pageNo, 
        pageSize: appliedParams.pageSize, 
        searchValue: appliedParams.searchValue 
    });
    const deleteMutation = useDeleteProject();
    const statusMutation = useUpdateProjectStatus();

    const handleOpenModal = (item?: ProjectDto) => {
        if (item) {
            setFormData({
                projectIDP: item.projectIDP,
                projectName: item.projectName,
                projectCode: item.projectCode || '',
                ownerDetails: item.ownerDetails || '',
                websiteCredential: item.websiteCredential || '',
                contactPerson: item.contactPerson || '',
                status: !!item.status,
            });
        } else {
            setFormData({
                projectIDP: 0,
                projectName: '',
                status: true,
                projectCode: '',
                ownerDetails: '',
                websiteCredential: '',
                contactPerson: ''
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

    const handleStatusUpdate = async (id: number, currentStatus: boolean) => {
        const action = currentStatus ? "deactivate" : "activate";
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} this project?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: `Yes, ${action} it!`
        });

        if (result.isConfirmed) {
            const res = await statusMutation.mutateAsync(id);
            handleActionResult(res);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
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

    const projects = data?.data || [];
    const totalRecords = data?.totalCount || 0;

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full overflow-hidden">
            <PageHeader 
                title="Project Master"
                description="Manage client portfolios and operational credentials"
                action={
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                    >
                        <Plus size={18} className="mr-2" /> Add New Project
                    </button>
                }
            />

            {/* List / Table Section Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Internal Filters Section */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
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
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Project</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Client/Head</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <TableSkeleton columns={4} />
                            ) : projects.length > 0 ? (
                                projects.map((p: ProjectDto) => (
                                    <tr key={p.projectIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenModal(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(p.projectIDP)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm border border-blue-100 uppercase">
                                                    {p.projectName?.[0] || 'P'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.projectName}</div>
                                                    <div className="text-xs text-gray-500 uppercase">{p.projectCode}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{p.contactPerson || '-'}</div>
                                            <div className="text-xs text-gray-500 italic lowercase">{p.ownerDetails || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusUpdate(p.projectIDP, p.status)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${p.status
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}>
                                                {p.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {p.status ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                                        No projects identified in current search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <DataPagination
                    totalItems={totalRecords}
                    pageSize={appliedParams.pageSize}
                    currentPage={appliedParams.pageNo}
                    onPageChange={(p) => setAppliedParams(prev => ({ ...prev, pageNo: p }))}
                    onPageSizeChange={(s) => setAppliedParams(prev => ({ ...prev, pageSize: s, pageNo: 1 }))}
                />
            </div>

            <ProjectFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                projectId={formData.projectIDP}
                onSuccess={() => refetch()}
            />
        </div>
    );
};
