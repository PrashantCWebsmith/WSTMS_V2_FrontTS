import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { Input } from '@/components/ui/input';
import { DataPagination } from '@/components/ui/DataPagination';
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    Plus, 
    Mail, 
    Calendar, 
    Repeat, 
    Trash2, 
    Search,
    Filter,
    X
} from 'lucide-react';
import { useSchedulers, useDeleteScheduler } from '../hooks/queries/scheduler.queries';
import { SchedulerFormModal } from '../components/SchedulerFormModal';
import type { SchedulerListDto, SchedulerCreateUpdateDto } from '../types/scheduler.types';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';

export const Scheduler: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<SchedulerCreateUpdateDto>({
        schedulerIDP: 0,
        emailSubject: '',
        emailBody: '',
        sendToEmailIDs: '',
        ccEmailIDs: '',
        startDate: new Date().toISOString(),
        repeatType: 'Daily',
        repeatDays: '',
        status: true
    });

    const [appliedParams, setAppliedParams] = useState({
        pageNo: 1,
        pageSize: 10,
        searchValue: ''
    });

    const { data, isLoading, refetch } = useSchedulers({ 
        pageNo: appliedParams.pageNo, 
        pageSize: appliedParams.pageSize, 
        searchValue: appliedParams.searchValue 
    });

    const deleteMutation = useDeleteScheduler();

    const handleSearch = () => {
        setAppliedParams(prev => ({
            ...prev,
            searchValue: searchTerm,
            pageNo: 1
        }));
    };

    const handleClear = () => {
        setSearchTerm('');
        setAppliedParams({
            pageNo: 1,
            pageSize: appliedParams.pageSize,
            searchValue: ''
        });
    };

    const schedulers = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data && Array.isArray((data as any).data)) return (data as any).data;
        return [];
    }, [data]);

    const handleOpenModal = (item?: SchedulerListDto) => {
        console.log('Opening modal with item:', item);
        if (item) {
            setFormData({
                schedulerIDP: item.schedulerIDP,
                emailSubject: item.emailSubject,
                emailBody: '', // Will be fetched by modal
                sendToEmailIDs: item.sendToEmailIDs,
                ccEmailIDs: '', // Will be fetched by modal
                startDate: item.startDate,
                repeatType: item.repeatType,
                repeatDays: '', // Will be fetched by modal
                status: item.status
            });
        } else {
            setFormData({
                schedulerIDP: 0,
                emailSubject: '',
                emailBody: '',
                sendToEmailIDs: '',
                ccEmailIDs: '',
                startDate: new Date().toISOString(),
                repeatType: 'Daily',
                repeatDays: '',
                status: true
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Terminate Automation?',
            text: 'This will permanently stop all upcoming triggers for this vector.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            confirmButtonText: 'Yes, terminate'
        });
        
        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success('Automation sequence terminated.');
            } catch (error) {
                toast.error('Termination sequence failed.');
            }
        }
    };

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Header Section */}
            <PageHeader 
                title="Task Scheduler Master"
                description="Engine rooms for system automation and recurring communications"
                showBack={true}
                onBack={() => navigate('/settings')}
                action={
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                    >
                        <Plus size={18} className="mr-2" /> New Automation
                    </button>
                }
            />

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-96">
                    <Input 
                        placeholder="Search operations..." 
                        icon={<Search size={18} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSearch}
                        className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                        title="Filter"
                    >
                        <Filter size={20} />
                    </button>
                    <button
                        onClick={handleClear}
                        className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        title="Clear"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm" />)
                ) : schedulers.map((s: SchedulerListDto) => (
                    <div key={s.schedulerIDP} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => handleDelete(s.schedulerIDP)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                        </div>
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
                            <Clock size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-1">{s.emailSubject}</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <Repeat size={14} className="text-blue-500" /> {s.repeatType}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-black text-gray-500">
                                <Mail size={14} className="text-indigo-500" /> {s.sendToEmailIDs}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-black text-gray-500">
                                <Calendar size={14} className="text-emerald-500" /> {new Date(s.startDate).toLocaleDateString()}
                            </div>
                        </div>

                        <Button onClick={() => handleOpenModal(s)} variant="outline" className="w-full rounded-2xl py-6 font-black border-2 border-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all">
                            MODIFY LOGIC
                        </Button>
                    </div>
                ))}
            </div>

            <DataPagination
                totalItems={data?.totalCount || 0}
                pageSize={appliedParams.pageSize}
                currentPage={appliedParams.pageNo}
                onPageChange={(p) => setAppliedParams(prev => ({ ...prev, pageNo: p }))}
                onPageSizeChange={(s) => setAppliedParams(prev => ({ ...prev, pageSize: s, pageNo: 1 }))}
            />

            <SchedulerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schedulerId={formData.schedulerIDP}
                onSuccess={() => refetch()}
            />
        </div>
    );
};

