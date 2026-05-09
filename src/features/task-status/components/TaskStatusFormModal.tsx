import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStatus, useSaveTaskStatus } from '../hooks/queries/task-status.queries';
import { taskStatusSchema, type TaskStatusFormValues } from '../validation/task-status.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';

interface TaskStatusFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    statusId?: number | null;
    onSuccess?: () => void;
}

export const TaskStatusFormModal: React.FC<TaskStatusFormModalProps> = ({
    isOpen,
    onClose,
    statusId,
    onSuccess
}) => {
    const isEditing = !!statusId;
    const { data: statusData, isLoading: isLoadingData } = useTaskStatus(statusId || 0);
    const saveMutation = useSaveTaskStatus();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<TaskStatusFormValues>({
        resolver: zodResolver(taskStatusSchema),
        defaultValues: {
            taskStatus: '',
            description: '',
            sortOrder: 0,
            status: true,
            isDisplayInKanban: true
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                taskStatus: '',
                description: '',
                sortOrder: 0,
                status: true,
                isDisplayInKanban: true
            });
            return;
        }

        if (statusData && isEditing) {
            reset({
                taskStatus: statusData.taskStatus,
                description: statusData.description || '',
                sortOrder: statusData.sortOrder,
                status: statusData.status,
                isDisplayInKanban: statusData.isDisplayInKanban
            });
        } else if (!isEditing) {
            reset({
                taskStatus: '',
                description: '',
                sortOrder: 0,
                status: true,
                isDisplayInKanban: true
            });
        }
    }, [statusData, reset, isOpen, isEditing]);

    const onFormSubmit = async (values: TaskStatusFormValues) => {
        const result = await saveMutation.mutateAsync({
            taskStatusIDP: isEditing ? statusId : 0,
            ...values
        });
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
            title={isEditing ? 'Edit Task Status' : 'New Task Status'}
            size="lg"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Status Name</label>
                            <input
                                {...register('taskStatus')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.taskStatus ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="e.g. In Progress, Completed"
                            />
                            {errors.taskStatus && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.taskStatus.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Description</label>
                            <textarea
                                {...register('description')}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Describe this status..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Sort Order</label>
                            <input
                                {...register('sortOrder', { valueAsNumber: true })}
                                type="number"
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Kanban Display</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
                                <input
                                    type="checkbox"
                                    {...register('isDisplayInKanban')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-[10px] font-black uppercase text-gray-400 group-hover:text-indigo-600 transition-colors peer-checked:text-indigo-600">
                                    Display in Board
                                </span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Status Active</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
                                <input
                                    type="checkbox"
                                    {...register('status')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                                    Active
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
                            {saveMutation.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
