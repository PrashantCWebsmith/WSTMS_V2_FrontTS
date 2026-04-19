import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft,
  Tags,
  Loader
} from 'lucide-react';
import { 
  useTaskType,
  useSaveTaskType
} from '../hooks/queries/task-type.queries';
import { taskTypeSchema, type TaskTypeFormValues } from '../validation/task-type.validation';
import { toast } from '@/utils/toast.utils';

export const TaskTypeForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const taskTypeId = Number(id);

    const { data: typeData, isLoading: isLoadingData } = useTaskType(taskTypeId);
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
        if (typeData) {
            reset({ 
                taskType: typeData.taskType, 
                description: typeData.description || '',
                status: typeData.status 
            });
        }
    }, [typeData, reset]);

    const onFormSubmit = async (values: TaskTypeFormValues) => {
        try {
            await saveMutation.mutateAsync({
                taskTypeIDP: isEditing ? taskTypeId : 0,
                ...values,
                description: values.description || ''
            });
            toast.success(`Task type ${isEditing ? 'updated' : 'created'} successfully`);
            navigate('/task-type');
        } catch (error) {
            toast.error('Failed to save task type');
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
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit Type' : 'New Type'}</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update functional category' : 'Create a new task classification'}</p>
                </div>
                <button
                    onClick={() => navigate('/task-type')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Type Name</label>
                            <input
                                {...register('taskType')}
                                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.taskType ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="e.g. Bug Fix, New Feature"
                            />
                            {errors.taskType && <p className="mt-1 text-xs text-red-500 font-bold">{errors.taskType.message}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="Details about this task type..."
                            />
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Status</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 w-fit">
                    <label className="relative inline-flex items-center cursor-pointer group">
                        <input 
                            type="checkbox" 
                            {...register('status')} 
                            className="sr-only peer" 
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                            Active
                        </span>
                    </label>
                </div>
            </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/task-type')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Type')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
