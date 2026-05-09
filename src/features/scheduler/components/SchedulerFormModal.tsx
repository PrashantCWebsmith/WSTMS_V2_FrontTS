import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSaveScheduler, useScheduler } from '../hooks/queries/scheduler.queries';
import { schedulerSchema, type SchedulerFormValues } from '../validation/scheduler.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnLink } from 'react-simple-wysiwyg';
import { Save } from 'lucide-react';

interface SchedulerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedulerId?: number | null;
    onSuccess?: () => void;
}

export const SchedulerFormModal: React.FC<SchedulerFormModalProps> = ({
    isOpen,
    onClose,
    schedulerId,
    onSuccess
}) => {
    console.log('SchedulerFormModal initialization - schedulerId:', schedulerId);
    const isEditing = !!schedulerId;
    const { data: schedulerData, isLoading: isLoadingData } = useScheduler(schedulerId || 0);
    const saveMutation = useSaveScheduler();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SchedulerFormValues>({
        resolver: zodResolver(schedulerSchema) as any,
        defaultValues: {
            emailSubject: '',
            emailBody: '',
            sendToEmailIDs: '',
            ccEmailIDs: '',
            startDate: new Date(),
            repeatType: 'Daily',
            repeatDays: '',
            status: true
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                emailSubject: '',
                emailBody: '',
                sendToEmailIDs: '',
                ccEmailIDs: '',
                startDate: new Date(),
                repeatType: 'Daily',
                repeatDays: '',
                status: true
            });
            return;
        }

        if (isEditing && schedulerData) {
            reset({
                emailSubject: schedulerData.emailSubject,
                emailBody: schedulerData.emailBody || '',
                sendToEmailIDs: schedulerData.sendToEmailIDs,
                ccEmailIDs: schedulerData.ccEmailIDs || '',
                startDate: schedulerData.startDate ? new Date(schedulerData.startDate) : new Date(),
                repeatType: schedulerData.repeatType || 'Daily',
                repeatDays: schedulerData.repeatDays || '',
                status: schedulerData.status ?? true
            });
        } else if (!isEditing) {
            reset({
                emailSubject: '',
                emailBody: '',
                sendToEmailIDs: '',
                ccEmailIDs: '',
                startDate: new Date(),
                repeatType: 'Daily',
                repeatDays: '',
                status: true
            });
        }
    }, [isOpen, isEditing, schedulerData, reset]);

    const onFormSubmit = async (values: SchedulerFormValues) => {
        console.log('Submitting scheduler form:', values);
        try {
            const payload = {
                schedulerIDP: isEditing ? (schedulerId || 0) : 0,
                ...values,
                startDate: values.startDate.toISOString(),
                ccEmailIDs: values.ccEmailIDs || null,
                repeatDays: values.repeatDays || null
            };
            console.log('Final payload:', payload);
            const result = await saveMutation.mutateAsync(payload as any);
            console.log('Mutation result:', result);

            handleActionResult(result);
            if (result?.outval === 1) {
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error('Mutation failed:', error);
            toast.error('An unexpected error occurred while saving.');
        }
    };

    const onFormError = (errors: any) => {
        console.log('Form validation errors:', errors);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Modify Trigger Logic' : 'Initiate New Automation'}
            size="xl"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit, onFormError)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Email Subject</label>
                                <input 
                                    {...register('emailSubject')}
                                    className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.emailSubject ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Subject line"
                                />
                                {errors.emailSubject && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.emailSubject.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Send To</label>
                                    <input 
                                        {...register('sendToEmailIDs')}
                                        className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.sendToEmailIDs ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Emails (comma separated)"
                                    />
                                    {errors.sendToEmailIDs && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.sendToEmailIDs.message}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">CC</label>
                                    <input 
                                        {...register('ccEmailIDs')}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="CC emails"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Repeat Type</label>
                                    <select 
                                         {...register('repeatType')}
                                         className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Once">Once</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Start Date</label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker 
                                                selected={field.value}
                                                onChange={(d: Date | null) => field.onChange(d)}
                                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Repeat Days</label>
                                <input 
                                    {...register('repeatDays')}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="e.g. Monday, Friday"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Active Status</label>
                                <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
                                    <input type="checkbox" className="sr-only peer" {...register('status')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Email Body</label>
                            <div className={`border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all ${errors.emailBody ? 'border-red-300' : 'border-gray-300'}`}>
                                <Controller
                                    name="emailBody"
                                    control={control}
                                    render={({ field }) => (
                                        <EditorProvider>
                                            <Toolbar>
                                                <BtnBold /><BtnItalic /><BtnLink />
                                            </Toolbar>
                                            <Editor 
                                                value={field.value || ''}
                                                onChange={(e: any) => field.onChange(e.target.value || '')}
                                                className="min-h-[300px] text-sm"
                                            />
                                        </EditorProvider>
                                    )}
                                />
                            </div>
                            {errors.emailBody && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.emailBody.message}</p>}
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
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {isEditing ? 'Save Changes' : 'Initiate Automation'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
