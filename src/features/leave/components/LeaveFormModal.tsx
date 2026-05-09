import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLeave, useSaveLeave } from '../hooks/queries/leave.queries';
import { leaveSchema, type LeaveFormValues } from '../validation/leave.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LeaveFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaveId?: number | null;
    onSuccess?: () => void;
}

export const LeaveFormModal: React.FC<LeaveFormModalProps> = ({
    isOpen,
    onClose,
    leaveId,
    onSuccess
}) => {
    const isEditing = !!leaveId;
    const { data: leaveData, isLoading: isLoadingData } = useLeave(leaveId || 0);
    const saveMutation = useSaveLeave();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            leaveName: '',
            leaveCode: '',
            isPaid: false,
            maxDaysPerYear: 0,
            description: '',
            status: true
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                leaveName: '',
                leaveCode: '',
                isPaid: false,
                maxDaysPerYear: 0,
                description: '',
                status: true
            });
            return;
        }

        if (leaveData && isEditing) {
            reset({
                leaveName: leaveData.leaveName,
                leaveCode: leaveData.leaveCode,
                isPaid: leaveData.isPaid,
                maxDaysPerYear: leaveData.maxDaysPerYear,
                description: leaveData.description || '',
                status: leaveData.status
            });
        } else if (!isEditing) {
            reset({
                leaveName: '',
                leaveCode: '',
                isPaid: false,
                maxDaysPerYear: 0,
                description: '',
                status: true
            });
        }
    }, [leaveData, reset, isOpen, isEditing]);

    const onFormSubmit = async (values: LeaveFormValues) => {
        const result = await saveMutation.mutateAsync({
            leaveIDP: isEditing ? leaveId : 0,
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
            title={isEditing ? 'Edit Leave Type' : 'New Leave Type'}
            size="lg"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Leave Name"
                                placeholder="e.g. Annual Leave"
                                {...register('leaveName')}
                                error={errors.leaveName?.message}
                            />
                        </div>

                        <div>
                            <Input
                                label="Leave Code"
                                placeholder="e.g. AL"
                                {...register('leaveCode')}
                                error={errors.leaveCode?.message}
                            />
                        </div>

                        <div>
                            <Input
                                label="Max Days / Year"
                                type="number"
                                {...register('maxDaysPerYear', { valueAsNumber: true })}
                                error={errors.maxDaysPerYear?.message}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Description</label>
                            <textarea
                                className={cn(
                                    "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm min-h-[100px]",
                                    errors.description && "border-red-500"
                                )}
                                placeholder="Details about when this leave can be applied..."
                                {...register('description')}
                            />
                            {errors.description && <p className="text-[10px] text-red-500 uppercase font-bold mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FileText size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Paid Leave</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('isPaid')} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CheckCircle size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Active Status</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('status')} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-lg px-6"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
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
