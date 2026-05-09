import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskType, useSaveTaskType } from '../hooks/queries/task-type.queries';
import { taskTypeSchema, type TaskTypeFormValues } from '../validation/task-type.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';

interface TaskTypeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskTypeId?: number | null;
    onSuccess?: () => void;
}

export const TaskTypeFormModal: React.FC<TaskTypeFormModalProps> = ({
    isOpen,
    onClose,
    taskTypeId,
    onSuccess
}) => {
    const isEditing = !!taskTypeId;
    const { data: typeData, isLoading: isLoadingData } = useTaskType(taskTypeId || 0);
    const saveMutation = useSaveTaskType();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<TaskTypeFormValues>({
        resolver: zodResolver(taskTypeSchema),
        defaultValues: {
            taskType: '',
            description: '',
            status: true
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                taskType: '',
                description: '',
                status: true
            });
            return;
        }

        if (typeData && isEditing) {
            reset({ 
                taskType: typeData.taskType, 
                description: typeData.description || '',
                status: typeData.status 
            });
        } else if (!isEditing) {
            reset({
                taskType: '',
                description: '',
                status: true
            });
        }
    }, [typeData, reset, isOpen, isEditing]);

    const onFormSubmit = async (values: TaskTypeFormValues) => {
        const result = await saveMutation.mutateAsync({
            taskTypeIDP: isEditing ? taskTypeId : 0,
            ...values,
            description: values.description || ''
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
            title={isEditing ? 'Edit Task Type' : 'New Task Type'}
            size="md"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Type Name</label>
                            <input
                                {...register('taskType')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.taskType ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="e.g. Bug Fix, New Feature"
                            />
                            {errors.taskType && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.taskType.message}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Description</label>
                            <textarea
                                {...register('description')}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Details about this task type..."
                            />
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
