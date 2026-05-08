import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    Plus, 
    Mail, 
    Calendar, 
    Repeat, 
    Trash2, 
    ArrowLeft,
    Search
} from 'lucide-react';
import { useSchedulers, useSaveScheduler, useDeleteScheduler } from '../hooks/queries/scheduler.queries';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnLink } from 'react-simple-wysiwyg';

interface SchedulerFormData {
    schedulerIDP: number;
    emailSubject: string;
    emailBody: string;
    sendToEmailIDs: string;
    ccEmailIDs: string;
    startDate: Date;
    repeatType: string;
    repeatDays: string;
}

export const Scheduler: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [current, setCurrent] = useState<any>(null);

    const { data, isLoading } = useSchedulers({ page, size: pageSize, search: debouncedSearch });
    const saveMutation = useSaveScheduler();
    const deleteMutation = useDeleteScheduler();

    const schedulers = useMemo(() => data?.data || [], [data]);
    const totalPages = useMemo(() => data?.totalPages || 0, [data]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const [formData, setFormData] = useState<SchedulerFormData>({
        schedulerIDP: 0,
        emailSubject: '',
        emailBody: '',
        sendToEmailIDs: '',
        ccEmailIDs: '',
        startDate: new Date(),
        repeatType: 'Daily',
        repeatDays: ''
    });

    const handleOpenForm = (item: any = null) => {
        if (item) {
            setCurrent(item);
            setFormData({
                schedulerIDP: item.schedulerIDP,
                emailSubject: item.emailSubject,
                emailBody: item.emailBody || '',
                sendToEmailIDs: item.sendToEmailIDs,
                ccEmailIDs: item.ccEmailIDs || '',
                startDate: new Date(item.startDate),
                repeatType: item.repeatType || 'Daily',
                repeatDays: item.repeatDays || ''
            });
        } else {
            setCurrent(null);
            setFormData({
                schedulerIDP: 0,
                emailSubject: '',
                emailBody: '',
                sendToEmailIDs: '',
                ccEmailIDs: '',
                startDate: new Date(),
                repeatType: 'Daily',
                repeatDays: ''
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        try {
            await saveMutation.mutateAsync({
                ...formData,
                startDate: formData.startDate.toISOString()
            } as any);
            toast.success('Automation logic synchronized successfully.');
            setIsFormOpen(false);
        } catch (error) {
            toast.error('Failed to synchronize automation parameters.');
        }
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

    if (isFormOpen) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                <PageHeader 
                    title={current ? 'Modify Trigger Logic' : 'Initiate New Automation'} 
                    description="Configure scheduling parameters and communication payload."
                    action={<Button variant="outline" onClick={() => setIsFormOpen(false)}><ArrowLeft size={18} className="mr-2"/> Back to List</Button>}
                />

                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Email Subject</label>
                                <input 
                                    value={formData.emailSubject}
                                    onChange={(e) => setFormData(prev => ({...prev, emailSubject: e.target.value}))}
                                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                                    placeholder="Subject line"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Send To (Email IDs)</label>
                                    <input 
                                        value={formData.sendToEmailIDs}
                                        onChange={(e) => setFormData(prev => ({...prev, sendToEmailIDs: e.target.value}))}
                                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                                        placeholder="comma, separated, emails"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">CC (Email IDs)</label>
                                    <input 
                                        value={formData.ccEmailIDs}
                                        onChange={(e) => setFormData(prev => ({...prev, ccEmailIDs: e.target.value}))}
                                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                                        placeholder="comma, separated, emails"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Repeat Type</label>
                                    <select 
                                         value={formData.repeatType}
                                         onChange={(e) => setFormData(prev => ({...prev, repeatType: e.target.value}))}
                                         className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-black text-gray-800 focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Once">Once</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Start Date</label>
                                    <div className="px-6 py-4 bg-gray-50 rounded-2xl">
                                         <DatePicker 
                                            selected={formData.startDate}
                                            onChange={(d: Date | null) => d && setFormData(prev => ({...prev, startDate: d}))}
                                            className="bg-transparent border-none font-black text-gray-800 focus:outline-none w-full"
                                         />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Repeat Days</label>
                                <input 
                                    value={formData.repeatDays}
                                    onChange={(e) => setFormData(prev => ({...prev, repeatDays: e.target.value}))}
                                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                                    placeholder="e.g. Monday, Friday (if Weekly)"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 flex flex-col h-full">
                            <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Email Body</label>
                            <div className="flex-1 bg-gray-50 rounded-[2rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500/20 transition-all">
                                <EditorProvider>
                                    <Toolbar>
                                        <BtnBold /><BtnItalic /><BtnLink />
                                    </Toolbar>
                                    <Editor 
                                        value={formData.emailBody}
                                        onChange={(e: any) => setFormData(prev => ({...prev, emailBody: e.target.value}))}
                                        className="h-full bg-transparent min-h-[400px]"
                                    />
                                </EditorProvider>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-50 flex gap-4">
                        <Button 
                            onClick={handleSave} 
                            isLoading={saveMutation.isPending}
                            className="flex-1 bg-gray-900 text-white py-8 rounded-[2rem] font-black shadow-2xl hover:scale-[1.02] transition-all"
                        >
                            SAVE SCHEDULER
                        </Button>
                        <Button onClick={() => setIsFormOpen(false)} variant="ghost" className="px-12 rounded-[2rem] font-black text-gray-400 hover:text-gray-900">
                            CANCEL
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">Automated Triggers</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5">Engine rooms for system automation and recurring communications</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold text-sm cursor-pointer"
                >
                    <Plus size={18} className="mr-2" /> New Automation
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 mb-6">
                <div className="w-full md:w-96">
                    <Input 
                        placeholder="Search operations..." 
                        icon={<Search size={18} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm" />)
                ) : schedulers.map(s => (
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

                        <Button onClick={() => handleOpenForm(s)} variant="outline" className="w-full rounded-2xl py-6 font-black border-2 border-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all">
                            MODIFY LOGIC
                        </Button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm mt-6">
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    totalCount={data?.totalCount || 0}
                />
            </div>
        </div>
    );
};
