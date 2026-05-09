import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRole, useSaveRole } from '../hooks/queries/role.queries';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { roleSchema, type RoleFormValues } from '../validation/role.validation';
import { Modal } from '@/components/ui/modal';

interface RoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleId?: number | null;
    onSuccess?: () => void;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
    isOpen,
    onClose,
    roleId,
    onSuccess
}) => {
    const isEditing = !!roleId;
    const { data: role, isLoading: isFetching } = useRole(roleId || 0);
    const saveMutation = useSaveRole();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            roleIDP: 0,
            roleName: '',
            status: true,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                roleIDP: 0,
                roleName: '',
                status: true,
            });
            return;
        }

        if (role && isEditing) {
            reset({
                roleIDP: role.roleIDP,
                roleName: role.roleName,
                status: !!role.status,
            });
        } else if (!isEditing) {
            reset({
                roleIDP: 0,
                roleName: '',
                status: true,
            });
        }
    }, [role, reset, isOpen, isEditing]);

    const onFormSubmit = async (formData: RoleFormValues) => {
        const result = await saveMutation.mutateAsync({ ...formData, roleIDP: isEditing ? roleId : 0 });
        handleActionResult(result);
        if (result?.outval === 1) {
            onSuccess?.();
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Role' : 'New Role'}
            size="md"
        >
            {isEditing && isFetching ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Role Name</label>
                            <input
                                {...register('roleName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.roleName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Enter role name"
                            />
                            {errors.roleName && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.roleName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Status</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
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

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50"
                        >
                            {saveMutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Role')}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
