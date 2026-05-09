import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIncident, useSaveIncident } from '../hooks/queries/incident.queries';
import { useProjects } from '@/features/projects/hooks/queries/project.queries';
import { incidentSchema, type IncidentFormValues } from '../validation/incident.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnLink, BtnClearFormatting } from 'react-simple-wysiwyg';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/utils/cn';

interface IncidentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    incidentId?: number | null;
    onSuccess?: () => void;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
    isOpen,
    onClose,
    incidentId,
    onSuccess
}) => {
    const { user } = useAuth();
    const isEditing = !!incidentId;
    const { data: incidentData, isLoading: isLoadingData } = useIncident(incidentId || 0);
    const { data: projectsData } = useProjects({ pageNo: 1, pageSize: 100 });
    const saveMutation = useSaveIncident();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IncidentFormValues>({
        resolver: zodResolver(incidentSchema),
        defaultValues: {
            projectIDF: 0,
            taskIDF: 0,
            userIDF: Number(user?.userIDP) || 0,
            criticalPoint: '',
            nonCriticalPoint: '',
            severity: 'Medium',
            incidentDate: new Date(),
            status: 'Open'
        }
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                projectIDF: 0,
                taskIDF: 0,
                userIDF: Number(user?.userIDP) || 0,
                criticalPoint: '',
                nonCriticalPoint: '',
                severity: 'Medium',
                incidentDate: new Date(),
                status: 'Open'
            });
            return;
        }

        if (incidentData && isEditing) {
            reset({ 
                projectIDF: incidentData.projectIDF,
                taskIDF: incidentData.taskIDF || 0,
                userIDF: incidentData.userIDF,
                criticalPoint: incidentData.criticalPoint || '',
                nonCriticalPoint: incidentData.nonCriticalPoint || '',
                severity: incidentData.severity || 'Medium',
                incidentDate: incidentData.incidentDate ? new Date(incidentData.incidentDate) : new Date(),
                status: incidentData.status || 'Open'
            });
        } else if (!isEditing) {
            reset({
                projectIDF: 0,
                taskIDF: 0,
                userIDF: Number(user?.userIDP) || 0,
                criticalPoint: '',
                nonCriticalPoint: '',
                severity: 'Medium',
                incidentDate: new Date(),
                status: 'Open'
            });
        }
    }, [incidentData, reset, isOpen, isEditing, user]);

    const onFormSubmit = async (values: IncidentFormValues) => {
        const result = await saveMutation.mutateAsync({
            incidentIDP: isEditing ? incidentId : 0,
            ...values,
            incidentDate: values.incidentDate.toISOString()
        });
        handleActionResult(result);
        if (result?.outval === 1) {
            onSuccess?.();
            onClose();
        }
    };

    const projects = useMemo(() => {
        const rawProjects = projectsData?.data || [];
        return rawProjects.map((p: any) => ({ value: p.projectIDP, label: p.projectName }));
    }, [projectsData]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Incident' : 'New Incident'}
            size="xl"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Controller
                                name="projectIDF"
                                control={control}
                                render={({ field }) => (
                                    <SearchableSelect
                                        label="Project"
                                        options={projects}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.projectIDF?.message}
                                        placeholder="Select Project"
                                    />
                                )}
                            />
                        </div>
                        
                        <div>
                            <Controller
                                name="severity"
                                control={control}
                                render={({ field }) => (
                                    <SearchableSelect
                                        label="Severity"
                                        options={[
                                            { value: 'Low', label: 'Low' },
                                            { value: 'Medium', label: 'Medium' },
                                            { value: 'High', label: 'High' },
                                            { value: 'Critical', label: 'Critical' }
                                        ]}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select Severity"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Incident Date</label>
                            <div className="relative">
                                <Controller
                                    name="incidentDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date | null) => field.onChange(date)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pl-9"
                                        />
                                    )}
                                />
                                <CalendarIcon size={14} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Status"
                                    options={[
                                        { value: 'Open', label: 'Open' },
                                        { value: 'In Progress', label: 'In Progress' },
                                        { value: 'Resolved', label: 'Resolved' },
                                        { value: 'Closed', label: 'Closed' }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select Status"
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Critical Points</label>
                            <div className={cn(
                                "border rounded-xl overflow-hidden",
                                errors.criticalPoint ? "border-red-500" : "border-gray-200"
                            )}>
                                <Controller
                                    name="criticalPoint"
                                    control={control}
                                    render={({ field }) => (
                                        <EditorProvider>
                                            <Editor
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="min-h-[150px] text-sm"
                                            >
                                                <Toolbar>
                                                    <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnLink /> <BtnClearFormatting />
                                                </Toolbar>
                                            </Editor>
                                        </EditorProvider>
                                    )}
                                />
                            </div>
                            {errors.criticalPoint && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.criticalPoint.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Non-Critical Points</label>
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <Controller
                                    name="nonCriticalPoint"
                                    control={control}
                                    render={({ field }) => (
                                        <EditorProvider>
                                            <Editor
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="min-h-[150px] text-sm"
                                            >
                                                <Toolbar>
                                                    <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnLink /> <BtnClearFormatting />
                                                </Toolbar>
                                            </Editor>
                                        </EditorProvider>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {isEditing ? 'Update Record' : 'Submit Incident'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
