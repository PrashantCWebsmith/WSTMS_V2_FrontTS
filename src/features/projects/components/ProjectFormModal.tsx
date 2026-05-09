import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProject, useSaveProject } from '../hooks/queries/project.queries';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { projectSchema, type ProjectFormValues } from '../validation/project.validation';
import { Modal } from '@/components/ui/modal';

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: number | null;
    onSuccess?: () => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
    isOpen,
    onClose,
    projectId,
    onSuccess
}) => {
    const isEditing = !!projectId;
    const { data: project, isLoading: isFetching } = useProject(projectId || 0);
    const saveMutation = useSaveProject();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            projectIDP: 0,
            projectName: '',
            ownerDetails: '',
            contactPerson: '',
            websiteCredential: '',
            status: true,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                projectIDP: 0,
                projectName: '',
                ownerDetails: '',
                contactPerson: '',
                websiteCredential: '',
                status: true,
            });
            return;
        }

        if (project && isEditing) {
            reset({
                projectIDP: project.projectIDP,
                projectName: project.projectName,
                ownerDetails: project.ownerDetails || '',
                contactPerson: project.contactPerson || '',
                websiteCredential: project.websiteCredential || '',
                status: !!project.status,
            });
        } else if (!isEditing) {
            reset({
                projectIDP: 0,
                projectName: '',
                ownerDetails: '',
                contactPerson: '',
                websiteCredential: '',
                status: true,
            });
        }
    }, [project, reset, isOpen, isEditing]);

    const onFormSubmit = async (formData: any) => {
        const result = await saveMutation.mutateAsync({ ...formData, projectIDP: isEditing ? projectId : 0 });
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
            title={isEditing ? 'Edit Project' : 'New Project'}
            size="lg"
        >
            {isEditing && isFetching ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Project Name</label>
                            <input
                                {...register('projectName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.projectName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Enter project name"
                            />
                            {errors.projectName && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.projectName.message}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Contact Person</label>
                            <input
                                {...register('contactPerson')}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Primary contact name"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Project Status</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
                                <input 
                                    type="checkbox" 
                                    {...register('status')} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-xs font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                                    Project Active
                                </span>
                            </label>
                        </div>

                        <div className="md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Owner Details</label>
                            <textarea
                                {...register('ownerDetails')}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Client or owner details..."
                            />
                        </div>

                        <div className="md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Website Credentials</label>
                            <textarea
                                {...register('websiteCredential')}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="URL, FTP, DB configurations..."
                            />
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
                            {saveMutation.isPending ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
