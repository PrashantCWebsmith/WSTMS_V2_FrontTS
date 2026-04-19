import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, UserCircle, Eye, EyeOff } from 'lucide-react';
import { useUser, useSaveUser, useUserLookups } from '../hooks/queries/user.queries';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { useRoleLookups } from '@/features/roles/hooks/queries/role.queries';
import { toast } from '@/utils/toast.utils';
import { userSchema, type UserFormValues } from '../validation/user.validation';

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!id;
  const userId = Number(id);

  const { data: user, isLoading: isFetching } = useUser(userId);
  const { data: roleLookups, isLoading: isLoadingRoles } = useRoleLookups();
  const { data: managerLookups, isLoading: isLoadingManagers } = useUserLookups();
  const saveMutation = useSaveUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
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
    if (user) {
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
    }
  }, [user, reset]);

  const onFormSubmit = async (formData: any) => {
    try {
      await saveMutation.mutateAsync({
        ...formData,
        userIDP: isEditing ? userId : 0
      });
      toast.success(`User ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/users');
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} user`);
    }
  };

  if ((isEditing && isFetching) || isLoadingRoles || isLoadingManagers) {
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
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{isEditing ? 'Edit User' : 'New User'}</h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">{isEditing ? 'Update existing credentials' : 'Create a new system access profile'}</p>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name <span className="text-red-500">*</span></label>
              <input
                {...register('userName')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.userName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g. john.doe"
              />
              {errors.userName && <p className="mt-1 text-xs text-red-500">{errors.userName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                {...register('userFullName')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.userFullName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g. John Doe"
              />
              {errors.userFullName && <p className="mt-1 text-xs text-red-500">{errors.userFullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID <span className="text-red-500">*</span></label>
              <input
                {...register('emailID')}
                type="email"
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.emailID ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="john@example.com"
              />
              {errors.emailID && <p className="mt-1 text-xs text-red-500">{errors.emailID.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No <span className="text-red-500">*</span></label>
              <input
                {...register('mobileNo')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.mobileNo ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="10 digit number"
              />
              {errors.mobileNo && <p className="mt-1 text-xs text-red-500">{errors.mobileNo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
              <input
                {...register('employeeCode')}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.employeeCode ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="WS001"
              />
              {errors.employeeCode && <p className="mt-1 text-xs text-red-500">{errors.employeeCode.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                {...register('joiningDate')}
                type="date"
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.joiningDate ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password {!isEditing && <span className="text-red-500">*</span>}</label>
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Full address details..."
              />
            </div>

            <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Account Status</label>
                <label className="relative inline-flex items-center cursor-pointer group w-fit">
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
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
               type="button"
               onClick={() => navigate('/users')}
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
      </div>
    </div>
  );
};
