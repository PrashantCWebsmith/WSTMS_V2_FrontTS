import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useProject, useSaveProject } from '../hooks/queries/project.queries';
import { toast } from '@/utils/toast.utils';
import { projectSchema, type ProjectFormValues } from '../validation/project.validation';

export const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;
    const projectId = parseInt(id || '0');

    const { data: project, isLoading: isFetching } = useProject(projectId);
    const saveMutation = useSaveProject();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
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
        if (project) {
            reset({
                projectIDP: project.projectIDP,
                projectName: project.projectName,
                ownerDetails: project.ownerDetails || '',
                contactPerson: project.contactPerson || '',
                websiteCredential: project.websiteCredential || '',
                status: !!project.status,
            });
        }
    }, [project, reset]);

    const onFormSubmit = async (formData: any) => {
        try {
            await saveMutation.mutateAsync({ ...formData, projectIDP: isEditing ? projectId : 0 });
            toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully`);
            navigate('/projects');
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} project`);
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
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit Project' : 'New Project'}</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update existing project lifecycle' : 'Create a new project entry'}</p>
                </div>
                <button
                    onClick={() => navigate('/projects')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Project Name</label>
                            <input
                                {...register('projectName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.projectName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Enter project name"
                            />
                            {errors.projectName && <p className="mt-1 text-xs text-red-500">{errors.projectName.message}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Contact Person</label>
                            <input
                                {...register('contactPerson')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.contactPerson ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Primary contact name"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Project Status</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit">
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
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Client or owner details..."
                            />
                        </div>

                        <div className="md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Website Credentials</label>
                            <textarea
                                {...register('websiteCredential')}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="URL, FTP, DB configurations..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
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
            </div>
        </div>
    );
};
