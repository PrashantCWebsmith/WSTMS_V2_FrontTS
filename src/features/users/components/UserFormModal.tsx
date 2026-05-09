import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useUser, useSaveUser, useUserLookups } from '../hooks/queries/user.queries';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { useRoleLookups } from '@/features/roles/hooks/queries/role.queries';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { userSchema, type UserFormValues } from '../validation/user.validation';
import { Modal } from '@/components/ui/modal';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number | null;
  onSuccess?: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ 
  isOpen, 
  onClose, 
  userId,
  onSuccess 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!userId;

  const { data: user, isLoading: isFetching } = useUser(userId || 0);
  const { data: roleLookups } = useRoleLookups();
  const { data: managerLookups } = useUserLookups();
  const saveMutation = useSaveUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({ 
    resolver: zodResolver(userSchema),
    defaultValues: {
      userIDP: 0,
      userName: '',
      userFullName: '',
      emailID: '',
      mobileNo: '',
      address: '',
      employeeCode: '',
      status: true,
      joiningDate: new Date().toISOString().split('T')[0],
      roleIDF: 4,
      reportingManagerIDF: 0,
      password: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user && isEditing) {
        reset({
          userIDP: user.userIDP,
          userName: user.userName,
          userFullName: user.userFullName,
          emailID: user.emailID,
          mobileNo: user.mobileNo,
          address: user.address || '',
          employeeCode: user.employeeCode,
          joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : '',
          roleIDF: user.roleIDF,
          reportingManagerIDF: user.reportingManagerIDF,
          status: !!user.status,
          password: '',
        });
      } else if (!isEditing) {
        reset({
          userIDP: 0,
          userName: '',
          userFullName: '',
          emailID: '',
          mobileNo: '',
          address: '',
          employeeCode: '',
          status: true,
          joiningDate: new Date().toISOString().split('T')[0],
          roleIDF: 4,
          reportingManagerIDF: 0,
          password: '',
        });
      }
    }
  }, [user, reset, isOpen, isEditing]);

  const onFormSubmit = async (formData: any) => {
    const result = await saveMutation.mutateAsync({
      ...formData,
      userIDP: isEditing ? userId : 0
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
      title={isEditing ? 'Edit User' : 'New User'}
      size="lg"
    >
      {isEditing && isFetching ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Name <span className="text-red-500">*</span></label>
              <input
                {...register('userName')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.userName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g. john.doe"
              />
              {errors.userName && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.userName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                {...register('userFullName')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.userFullName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g. John Doe"
              />
              {errors.userFullName && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.userFullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email ID <span className="text-red-500">*</span></label>
              <input
                {...register('emailID')}
                type="email"
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.emailID ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="john@example.com"
              />
              {errors.emailID && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.emailID.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile No <span className="text-red-500">*</span></label>
              <input
                {...register('mobileNo')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.mobileNo ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="10 digit number"
              />
              {errors.mobileNo && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.mobileNo.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employee Code</label>
              <input
                {...register('employeeCode')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.employeeCode ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="WS001"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Joining Date</label>
              <input
                {...register('joiningDate')}
                type="date"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Controller
                name="roleIDF"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    label="Role"
                    options={roleLookups?.map((r: any) => ({ value: r.roleIDP, label: r.roleName })) || []}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.roleIDF?.message}
                    placeholder="Select Role"
                    required
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="reportingManagerIDF"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    label="Reporting Manager"
                    options={[
                      { value: 0, label: 'No Manager' },
                      ...(managerLookups?.map((m: any) => ({ value: m.userIDP, label: m.userFullName || m.userName })) || [])
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.reportingManagerIDF?.message}
                    placeholder="Search/Select Manager"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password {!isEditing && <span className="text-red-500">*</span>}</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full border rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder={isEditing ? "Leave blank to keep unchanged" : "Enter password"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.password.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
              <textarea
                {...register('address')}
                rows={2}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Full address details..."
              />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Account Status</label>
                <label className="relative inline-flex items-center cursor-pointer group w-fit mt-1">
                    <input 
                        type="checkbox" 
                        {...register('status')} 
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-xs font-black uppercase text-gray-400 group-hover:text-blue-600 transition-colors peer-checked:text-blue-600">
                        Account Active
                    </span>
                </label>
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
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
