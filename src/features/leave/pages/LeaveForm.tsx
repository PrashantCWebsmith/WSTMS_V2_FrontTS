import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Calendar,
  CreditCard
} from 'lucide-react';
import {
  useLeave,
  useSaveLeave
} from '../hooks/queries/leave.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveSchema, type LeaveFormValues } from '../validation/leave.validation';
import { toast } from '@/utils/toast.utils';
import { cn } from '@/utils/cn';

export const LeaveForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: leaveData, isLoading: isLoadingData } = useLeave(Number(id));
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
    if (leaveData) {
      reset({
        leaveName: leaveData.leaveName,
        leaveCode: leaveData.leaveCode,
        isPaid: leaveData.isPaid,
        maxDaysPerYear: leaveData.maxDaysPerYear,
        description: leaveData.description || '',
        status: leaveData.status
      });
    }
  }, [leaveData, reset]);

  const onFormSubmit = async (values: LeaveFormValues) => {
    try {
      await saveMutation.mutateAsync({
        leaveIDP: isEditing ? Number(id) : 0,
        ...values
      });
      toast.success(`Leave type ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/leave');
    } catch (error) {
      toast.error('Failed to save leave type');
    }
  };

  if (isEditing && isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 max-w-3xl mx-auto">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit Leave Type' : 'New Leave Type'}</h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update the details and policy for this leave category' : 'Define a new leave category and its annual limits'}</p>
        </div>
        <button
          onClick={() => navigate('/leave')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <Input
                label="Leave Name"
                placeholder="e.g. Annual Leave"
                {...register('leaveName')}
                error={errors.leaveName?.message}
                autoFocus
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
              <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
              <textarea
                className={cn(
                  "w-full mt-2 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm min-h-[120px]",
                  errors.description && "border-red-500"
                )}
                placeholder="Details about when this leave can be applied..."
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1 ml-1">{errors.description.message}</p>}
            </div>

            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Paid Leave</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" {...register('isPaid')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Active Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" {...register('status')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
               type="button"
               onClick={() => navigate('/leave')}
               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
