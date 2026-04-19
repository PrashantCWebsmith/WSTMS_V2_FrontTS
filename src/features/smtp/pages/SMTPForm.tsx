import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft,
  Server,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { 
  useSMTP,
  useSaveSMTP
} from '../hooks/queries/smtp.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { smtpSchema, type SMTPFormValues } from '../validation/smtp.validation';
import { toast } from '@/utils/toast.utils';

export const SMTPForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const smtpId = Number(id);
  const [showPassword, setShowPassword] = useState(false);

  const { data: smtpData, isLoading: isLoadingData } = useSMTP(smtpId);
  const saveMutation = useSaveSMTP();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SMTPFormValues>({
    resolver: zodResolver(smtpSchema),
    defaultValues: {
      smtp: '',
      portNo: 587,
      userName: '',
      password: '',
      enableSSL: true,
      status: true
    }
  });

  useEffect(() => {
    if (smtpData) {
      reset({ 
        smtp: smtpData.smtp, 
        portNo: smtpData.portNo,
        userName: smtpData.userName,
        password: smtpData.password || '',
        enableSSL: smtpData.enableSSL,
        status: smtpData.status 
      });
    }
  }, [smtpData, reset]);

  const onFormSubmit = async (values: SMTPFormValues) => {
    try {
      await saveMutation.mutateAsync({
        smtpidp: isEditing ? smtpId : 0,
        ...values
      });
      toast.success(`SMTP configuration ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/smtp');
    } catch (error) {
      toast.error('Failed to save SMTP configuration');
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
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
            {isEditing ? 'Edit SMTP' : 'New SMTP Server'}
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">
            {isEditing ? 'Update mail server connection settings' : 'Configure outgoing mail notifications'}
          </p>
        </div>
        <button
          onClick={() => navigate('/smtp')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <Input 
                label="SMTP Server / Host"
                placeholder="e.g. smtp.gmail.com"
                {...register('smtp')}
                error={errors.smtp?.message}
                autoFocus
              />
            </div>
            
            <div className="md:col-span-2">
              <Input 
                label="Username / Email"
                placeholder="name@example.com"
                {...register('userName')}
                error={errors.userName?.message}
              />
            </div>

            <div>
              <Input 
                label="Port Number"
                type="number"
                {...register('portNo', { valueAsNumber: true })}
                error={errors.portNo?.message}
                placeholder="587"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative mt-2 focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl transition-all">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm pr-12"
                  {...register('password')}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-6 p-8 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider block">Enable SSL</span>
                      <span className="text-[10px] text-gray-400 font-medium">Use encrypted connection for mail transmission</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      {...register('enableSSL')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider block">Status</span>
                      <span className="text-[10px] text-gray-400 font-medium">Is this server currently active for system emails?</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      {...register('status')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
               </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10 border-t border-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 rounded-2xl border-gray-200 text-gray-600 font-bold cursor-pointer"
              onClick={() => navigate('/smtp')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-wider cursor-pointer"
              isLoading={saveMutation.isPending}
            >
              <Save size={20} className="mr-2" />
              {isEditing ? 'Update Config' : 'Save Config'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
