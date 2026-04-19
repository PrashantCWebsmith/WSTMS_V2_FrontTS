import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Briefcase, 
  Calendar, 
  Phone, 
  MapPin, 
  Link,
  Code,
  Edit2,
  X,
  Check,
  LogOut,
  Camera
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useProfile, useUpdateProfile } from '../hooks/queries/profile.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/utils/toast.utils';
import { cn } from '@/utils/cn';

const profileSchema = z.object({
  userFullName: z.string().min(1, 'Full name is required').max(100, 'Too long'),
  joiningDate: z.string().optional().nullable(),
  address: z.string().max(500, 'Too long').default(''),
  linkedInProfile: z.string().or(z.literal('')).default(''),
  gitUserName: z.string().max(100, 'Too long').default('')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading } = useProfile(Number(user?.userIDP));
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) as any });

  useEffect(() => {
    if (profile) {
      reset({
        userFullName: profile.userFullName || '',
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : '',
        address: profile.address || '',
        linkedInProfile: profile.linkedInProfile || '',
        gitUserName: profile.gitUserName || ''
      });
    }
  }, [profile, reset]);

  const onFormSubmit = async (values: ProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({
        ...values,
        joiningDate: values.joiningDate ? new Date(values.joiningDate).toISOString() : null
      } as any);
      setIsEditing(false);
      toast.success('Account profile synchronized successfully');
    } catch (error) {
       toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const initials = profile?.userFullName?.split(' ').map(n => n[0]).join('').toUpperCase() || profile?.userName?.substring(0, 2).toUpperCase() || '??';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-6 pb-8">
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          <div className="absolute top-6 right-8">
            <span className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg",
              profile?.status ? "bg-emerald-500/20 text-white border-emerald-400/30" : "bg-rose-500/20 text-white border-rose-400/30"
            )}>
              {profile?.status ? 'ACTIVE ACCOUNT' : 'INACTIVE'}
            </span>
          </div>
        </div>

        <div className="px-6 pb-8 pt-0">
          <div className="flex flex-col md:flex-row items-end -mt-16 gap-4 mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-2xl relative z-10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 text-3xl font-black">
                  {initials}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 z-20 p-2 bg-white rounded-xl shadow-xl border border-gray-100 text-gray-500 hover:text-primary transition-all group-hover:scale-110 active:scale-95">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profile?.userFullName || profile?.userName}</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-500 font-medium">
                <span className="text-primary font-bold">@{profile?.userName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Shield size={14} className="text-blue-500" />
                  {profile?.roleName || 'Member'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pb-2 w-full md:w-auto">
              {!isEditing ? (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="flex-1 md:flex-none rounded-xl px-6 shadow-blue-600/20 shadow-lg group">
                  <Edit2 size={18} className="mr-2 group-hover:rotate-12 transition-transform" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 flex-1 md:flex-none">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl px-4 border-gray-200">
                    <X size={18} className="mr-2" /> Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit(onFormSubmit)} isLoading={updateMutation.isPending} className="rounded-xl px-6 shadow-blue-600/20 shadow-lg">
                    <Check size={18} className="mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Account Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Email Address</div>
                        <div className="font-bold text-gray-900 truncate">{profile?.emailID}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                        <Phone size={18} />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</div>
                        <div className="font-bold text-gray-900">{profile?.mobileNo || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                        <Briefcase size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Employee Code</div>
                        <div className="font-bold text-gray-900">{profile?.employeeCode || 'WST-000'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-wider hover:bg-rose-100 transition-all border border-rose-100 active:scale-95">
                    <LogOut size={16} />
                    Log Out of Account
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    {isEditing ? (
                      <Input 
                        {...register('userFullName')}
                        error={errors.userFullName?.message}
                        placeholder="John Doe"
                        className="rounded-2xl border-gray-200"
                        icon={<User size={18} />}
                      />
                    ) : (
                      <div className="p-4 bg-white border border-gray-50 rounded-2xl font-bold text-gray-900 shadow-sm">
                        {profile?.userFullName || 'N/A'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Joining Date</label>
                    {isEditing ? (
                      <div className="relative">
                        <input 
                          type="date"
                          className={cn(
                            "w-full rounded-2xl border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all pl-10",
                            errors.joiningDate && "border-red-500"
                          )}
                          {...register('joiningDate')}
                        />
                        <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                        {errors.joiningDate && <p className="text-[10px] text-red-500 mt-1">{errors.joiningDate.message}</p>}
                      </div>
                    ) : (
                      <div className="p-4 bg-white border border-gray-50 rounded-2xl font-bold text-gray-900 flex items-center gap-2 shadow-sm">
                        <Calendar size={18} className="text-blue-500" />
                        {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Office Address</label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <textarea 
                        className={cn(
                          "w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]",
                          errors.address && "border-red-500"
                        )}
                        placeholder="Street, City, Country"
                        {...register('address')}
                      />
                      {errors.address && <p className="text-[10px] text-red-500">{errors.address.message}</p>}
                    </div>
                  ) : (
                    <div className="p-4 bg-white border border-gray-50 rounded-2xl font-bold text-gray-900 flex items-start gap-2 shadow-sm">
                      <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <span>{profile?.address || 'N/A'}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">LinkedIn Profile</label>
                    {isEditing ? (
                      <Input 
                        {...register('linkedInProfile')}
                        error={errors.linkedInProfile?.message}
                        placeholder="https://linkedin.com/in/..."
                        className="rounded-2xl border-gray-200"
                        icon={<Link size={18} />}
                      />
                    ) : (
                      <div className="p-4 bg-white border border-gray-50 rounded-2xl shadow-sm">
                        {profile?.linkedInProfile ? (
                          <a href={profile.linkedInProfile} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                            <Link size={18} />
                            Visit Profile
                          </a>
                        ) : (
                          <span className="text-gray-400 font-medium italic">No profile linked</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">GitHub Username</label>
                    {isEditing ? (
                      <Input 
                        {...register('gitUserName')}
                        error={errors.gitUserName?.message}
                        placeholder="octocat"
                        className="rounded-2xl border-gray-200"
                        icon={<Code size={18} />}
                      />
                    ) : (
                      <div className="p-4 bg-white border border-gray-50 rounded-2xl flex items-center gap-2 text-gray-900 font-bold font-mono shadow-sm">
                        <Code size={18} className="text-gray-900" />
                        {profile?.gitUserName || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
