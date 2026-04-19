import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Shield } from 'lucide-react';
import { useRole, useSaveRole } from '../hooks/queries/role.queries';
import { toast } from '@/utils/toast.utils';
import { roleSchema, type RoleFormValues } from '../validation/role.validation';

export const RoleForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;
    const roleId = parseInt(id || '0');

    const { data: role, isLoading: isFetching } = useRole(roleId);
    const saveMutation = useSaveRole();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            roleIDP: 0,
            roleName: '',
            status: true,
        },
    });

    useEffect(() => {
        if (role) {
            reset({
                roleIDP: role.roleIDP,
                roleName: role.roleName,
                status: !!role.status,
            });
        }
    }, [role, reset]);

    const onFormSubmit = async (formData: RoleFormValues) => {
        try {
            await saveMutation.mutateAsync({ ...formData, roleIDP: isEditing ? roleId : 0 });
            toast.success(`Role ${isEditing ? 'updated' : 'created'} successfully`);
            navigate('/roles');
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} role`);
        }
    };

    if (isEditing && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit Role' : 'New Role'}</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update existing system privileges' : 'Create a new access level'}</p>
                </div>
                <button
                    onClick={() => navigate('/roles')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Role Name</label>
                            <input
                                {...register('roleName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.roleName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Enter role name"
                            />
                            {errors.roleName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.roleName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Status</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit">
                                <input 
                                    type="checkbox" 
                                    {...register('status')} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-xs font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                                    Role Active
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/roles')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Role')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
