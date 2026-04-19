import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft,
  Flag,
  Loader
} from 'lucide-react';
import { usePriority, useSavePriority } from '../hooks/queries/priority.queries';
import { prioritySchema, type PriorityFormValues } from '../validation/priority.validation';
import { toast } from '@/utils/toast.utils';

export const PriorityForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const priorityId = Number(id);

    const { data: priorityData, isLoading: isLoadingData } = usePriority(priorityId);
    const saveMutation = useSavePriority();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<PriorityFormValues>({
        resolver: zodResolver(prioritySchema),
        defaultValues: {
            priorityName: '',
            priorityColor: '#3b82f6',
            description: '',
            status: true
        }
    });

    useEffect(() => {
        if (priorityData) {
            reset({
                priorityName: priorityData.priorityName,
                priorityColor: priorityData.priorityColor,
                description: priorityData.description || '',
                status: priorityData.status
            });
        }
    }, [priorityData, reset]);

    const onFormSubmit = async (values: PriorityFormValues) => {
        try {
            await saveMutation.mutateAsync({
                priorityIDP: isEditing ? priorityId : 0,
                ...values
            });
            toast.success(`Priority ${isEditing ? 'updated' : 'created'} successfully`);
            navigate('/priority');
        } catch (error) {
            toast.error('Failed to save priority');
        }
    };

    if (isEditing && isLoadingData) {
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
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit Priority' : 'New Priority'}</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update task urgency level' : 'Create a new urgency classification'}</p>
                </div>
                <button
                    onClick={() => navigate('/priority')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Priority Name</label>
                            <input
                                {...register('priorityName')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.priorityName ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="e.g. Critical, High, Low"
                            />
                            {errors.priorityName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.priorityName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority Color</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300 p-1 shadow-sm"
                                    {...register('priorityColor')}
                                />
                                <input
                                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#000000"
                                    {...register('priorityColor')}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="Details about this priority level..."
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Status</label>
                            <label className="relative inline-flex items-center cursor-pointer group w-fit">
                                <input 
                                    type="checkbox" 
                                    {...register('status')} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                                    {watch('status') ? 'Active Priority' : 'Inactive Priority'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/priority')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Priority')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
