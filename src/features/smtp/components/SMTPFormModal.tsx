import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSMTP, useSaveSMTP } from '../hooks/queries/smtp.queries';
import { smtpSchema, type SMTPFormValues } from '../validation/smtp.validation';
import { toast, handleActionResult } from '@/utils/toast.utils';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ShieldCheck, Save } from 'lucide-react';

interface SMTPFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    smtpId?: number | null;
    onSuccess?: () => void;
}

export const SMTPFormModal: React.FC<SMTPFormModalProps> = ({
    isOpen,
    onClose,
    smtpId,
    onSuccess
}) => {
    const isEditing = !!smtpId;
    const [showPassword, setShowPassword] = useState(false);
    const { data: smtpData, isLoading: isLoadingData } = useSMTP(smtpId || 0);
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
        if (!isOpen) {
            reset({
                smtp: '',
                portNo: 587,
                userName: '',
                password: '',
                enableSSL: true,
                status: true
            });
            return;
        }

        if (smtpData && isEditing) {
            reset({ 
                smtp: smtpData.smtp, 
                portNo: smtpData.portNo,
                userName: smtpData.userName,
                password: smtpData.password || '',
                enableSSL: smtpData.enableSSL ?? true,
                status: smtpData.status ?? true 
            });
        } else if (!isEditing) {
            reset({
                smtp: '',
                portNo: 587,
                userName: '',
                password: '',
                enableSSL: true,
                status: true
            });
        }
    }, [smtpData, reset, isOpen, isEditing]);

    const onFormSubmit = async (values: SMTPFormValues) => {
        const result = await saveMutation.mutateAsync({
            smtpidp: isEditing ? smtpId : 0,
            ...values
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
            title={isEditing ? 'Edit SMTP' : 'New SMTP Server'}
            size="lg"
        >
            {isEditing && isLoadingData ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Input 
                                label="SMTP Server / Host"
                                placeholder="e.g. smtp.gmail.com"
                                {...register('smtp')}
                                error={errors.smtp?.message}
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
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Password</label>
                            <div className={`relative border rounded-lg transition-all focus-within:ring-2 focus-within:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="w-full p-2 bg-transparent text-sm focus:outline-none"
                                    {...register('password')}
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-[10px] text-red-500 uppercase font-bold">{errors.password.message}</p>}
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Enable SSL</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('enableSSL')} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Active Status</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('status')} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-lg px-6"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm disabled:opacity-50"
                        >
                            {saveMutation.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
