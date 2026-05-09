import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
    X
} from 'lucide-react';
import { DataPagination } from '@/components/ui/DataPagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { useUsers, useUpdateUserStatus, useDeleteUser } from '../hooks/queries/user.queries';
import { useRoles } from '@/features/roles/hooks/queries/role.queries';
import Swal from 'sweetalert2';
import { toast, handleActionResult } from '@/utils/toast.utils';
import type { UserListDto, UserCreateUpdateDto } from '../types/user.types';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { UserFormModal } from '../components/UserFormModal';

export const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<UserCreateUpdateDto>({
        userIDP: 0,
        userName: '',
        userFullName: '',
        emailID: '',
        mobileNo: '',
        roleIDF: 4,
        status: true,
        employeeCode: '',
        joiningDate: new Date().toISOString().split('T')[0],
        reportingManagerIDF: 0,
        address: '',
        password: ''
    });

    // Applied params (this drives the query)
    const [appliedParams, setAppliedParams] = useState({
        pageNo: 1,
        pageSize: 10,
        searchValue: '',
        roleIDF: 0
    });

    const { data, isLoading, refetch } = useUsers(
        { 
            pageNo: appliedParams.pageNo, 
            pageSize: appliedParams.pageSize, 
            searchValue: appliedParams.searchValue 
        }, 
        { roleIDF: appliedParams.roleIDF }
    );

    const { data: rolesRes } = useRoles({ pageNo: 1, pageSize: 100 });
    const roles = rolesRes?.data || [];

    const statusMutation = useUpdateUserStatus();
    const deleteMutation = useDeleteUser();

    const handleOpenModal = (item?: UserListDto) => {
        if (item) {
            setFormData({
                userIDP: item.userIDP,
                userName: item.userName,
                userFullName: item.userFullName || '',
                emailID: item.emailID || '',
                mobileNo: item.mobileNo || '',
                roleIDF: 0, // Will be fetched by ID in modal
                status: item.status,
            });
        } else {
            setFormData({
                userIDP: 0,
                userName: '',
                userFullName: '',
                emailID: '',
                mobileNo: '',
                roleIDF: 4,
                status: true,
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id: number, currentStatus: boolean) => {
        const action = currentStatus ? "deactivate" : "activate";
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} this user?`,
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

    const handleSearch = () => {
        setAppliedParams(prev => ({
            ...prev,
            searchValue: searchTerm,
            roleIDF: selectedRole,
            pageNo: 1
        }));
    };

    const users = data?.data || [];
    const totalItems = data?.totalCount || 0;

    return (
        <div className="p-6 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">User Master</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">Manage system access levels and personnel profiles</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                >
                    <Plus size={18} className="mr-2" /> Add New User
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Filters Section */}
                <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <SearchableSelect
                            options={[{ value: 0, label: 'All Roles' }, ...roles.map(r => ({ value: r.roleIDP, label: r.roleName }))]}
                            value={selectedRole}
                            onChange={(val) => setSelectedRole(Number(val))}
                            placeholder="All Roles"
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-2">
                        <button
                            onClick={handleSearch}
                            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                            title="Filter"
                        >
                            <Filter size={20} />
                        </button>
                        <button
                            onClick={() => { 
                                setSearchTerm(''); 
                                setSelectedRole(0); 
                                setAppliedParams({
                                    pageNo: 1,
                                    pageSize: appliedParams.pageSize,
                                    searchValue: '',
                                    roleIDF: 0
                                });
                            }}
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">UserInfo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Role/Dept</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <TableSkeleton columns={4} />
                            ) : users.length > 0 ? (
                                users.map((u: UserListDto) => (
                                    <tr key={u.userIDP} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => navigate(`/users/${u.userIDP}/center`)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" title="User Center">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal(u)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(u.userIDP)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase shadow-sm border border-blue-100">
                                                        {u.userName ? u.userName.substring(0, 2) : 'UU'}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{u.userName}</div>
                                                    <div className="text-xs text-gray-500">{u.emailID}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{u.roleName || '-'}</div>
                                            <div className="text-xs text-gray-500">{u.mobileNo || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusUpdate(u.userIDP, u.status)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${u.status
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}>
                                                {u.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {u.status ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                                        No users registered matching criteria.
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
                    onPageChange={(p) => setAppliedParams(prev => ({ ...prev, pageNo: p }))}
                    onPageSizeChange={(s) => setAppliedParams(prev => ({ ...prev, pageSize: s, pageNo: 1 }))}
                />
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                userId={formData.userIDP}
                onSuccess={() => refetch()}
            />
        </div>
    );
};
