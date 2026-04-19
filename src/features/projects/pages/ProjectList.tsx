import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Briefcase,
    Globe,
    User,
    CheckCircle,
    XCircle,
    X
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { useProjects, useDeleteProject, useUpdateProjectStatus } from '../hooks/queries/project.queries';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';
import type { ProjectViewModel } from '../types/project.types';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading } = useProjects({ page, size: pageSize, search: debouncedSearch });
    const deleteMutation = useDeleteProject();
    const statusMutation = useUpdateProjectStatus();

    const handleSearch = () => {
        setDebouncedSearch(searchTerm);
        setPage(1);
    };

    const handleClear = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setPage(1);
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
            try {
                await statusMutation.mutateAsync(id);
                toast.success(`Project has been ${action}d.`);
            } catch (error) {
                toast.error('Failed to update status');
            }
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
            try {
                await deleteMutation.mutateAsync(id);
                toast.success('Project deleted successfully');
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const projects = data?.data || [];
    const totalRecords = data?.totalCount || 0;

    return (
        <div className="p-6 space-y-6 w-full overflow-hidden">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">Project Master</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">Manage client portfolios and operational credentials</p>
                </div>
                <button
                    onClick={() => navigate('/projects/new')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                >
                    <Plus size={18} className="mr-2" /> Add New Project
                </button>
            </div>

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
                                projects.map((p: ProjectViewModel) => (
                                    <tr key={p.projectIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => navigate(`/projects/${p.projectIDP}/edit`)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
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

                {/* Pagination Section */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalRecords)}</span> to <span className="font-medium">{Math.min(page * pageSize, totalRecords)}</span> of <span className="font-medium">{totalRecords}</span> results
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <div className="w-32">
                                <SearchableSelect
                                    options={[10, 20, 50, 100].map(size => ({ value: size, label: `Show ${size}` }))}
                                    value={pageSize}
                                    onChange={(val) => setPageSize(Number(val))}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="flex items-center -space-x-px shadow-sm rounded-md">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed first:rounded-l-lg last:rounded-r-lg"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * pageSize >= totalRecords}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed first:rounded-l-lg last:rounded-r-lg"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
