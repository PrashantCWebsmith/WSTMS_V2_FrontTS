import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePriority, useSavePriority } from '../hooks/queries/priority.queries';
import { prioritySchema, type PriorityFormValues } from '../validation/priority.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';

interface PriorityFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    priorityId?: number | null;
    onSuccess?: () => void;
}

export const PriorityFormModal: React.FC<PriorityFormModalProps> = ({
    isOpen,
    onClose,
    priorityId,
    onSuccess
}) => {
    const isEditing = !!priorityId;
    const { data: priorityData, isLoading: isLoadingData } = usePriority(priorityId || 0);
    const saveMutation = useSavePriority();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<PriorityFormValues>({
        resolver: zodResolver(prioritySchema),
        defaultValues: {
            priorityName: '',
            description: '',
            status: true
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                priorityName: '',
                description: '',
                status: true
            });
            return;
        }

        if (priorityData && isEditing) {
            reset({
                priorityName: priorityData.priorityName,
                description: priorityData.description || '',
                status: priorityData.status || false
            });
        } else if (!isEditing) {
            reset({
                priorityName: '',
                description: '',
                status: true
            });
        }
    }, [priorityData, reset, isOpen, isEditing]);

    const onFormSubmit = async (values: PriorityFormValues) => {
        const result = await saveMutation.mutateAsync({
            priorityIDP: isEditing ? priorityId : 0,
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
            title={isEditing ? 'Edit Priority' : 'New Priority'}
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
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Priority Name</label>
                            <input
                                {...register('priorityName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.priorityName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="e.g. Critical, High, Low"
                            />
                            {errors.priorityName && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.priorityName.message}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Description</label>
                            <textarea
                                {...register('description')}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Details about this priority level..."
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
                                    {watch('status') ? 'Active Priority' : 'Inactive Priority'}
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
