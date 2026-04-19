import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, Square, Save, Briefcase, User, AlignLeft, Type, CheckSquare } from 'lucide-react';
import Select from 'react-select';
import { useAuth } from '@/providers/auth-provider';
import { useTaskLookups, useProjectUsers, useSaveTask } from '../hooks/queries/task.queries';
import { useSaveTaskComment } from '../hooks/queries/task-comment.queries';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';

interface QuickTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionType: string;
    onSaveSuccess?: () => void;
}

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({ 
    isOpen, 
    onClose, 
    actionType, 
    onSaveSuccess 
}) => {
    const { user } = useAuth();
    const { data: lookups } = useTaskLookups();
    const saveTaskMutation = useSaveTask();
    const saveCommentMutation = useSaveTaskComment();

    const [seconds, setSeconds] = useState(0);
    const [view, setView] = useState<'timer' | 'form'>('timer');

    const [formData, setFormData] = useState({
        projectIDF: 0,
        taskTitle: '',
        taskDescription: '',
        assignToIDF: 0,
        selectedTaskID: 0
    });

    const { data: projectMembers } = useProjectUsers(formData.projectIDF);
    // Note: In V2 we might need a specific query for project-wise tasks if not already available
    // For now, we'll assume the user might want to pick an existing task from the lookup or search
    // But V1 had a specific service for this. 

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isOpen && view === 'timer') {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (interval) clearInterval(interval);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isOpen, view]);

    useEffect(() => {
        if (isOpen) {
            setSeconds(0);
            setView('timer');
            setFormData({
                projectIDF: 0,
                taskTitle: '',
                taskDescription: '',
                assignToIDF: 0,
                selectedTaskID: 0
            });
        }
    }, [isOpen]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };

    const handleStopClick = () => {
        setView('form');
        setFormData(prev => ({
            ...prev,
            taskTitle: `${actionType} - ${new Date().toLocaleDateString()}`
        }));
    };

    const handleSave = async () => {
        if (!formData.projectIDF) {
            toast.error("Please select a project");
            return;
        }

        if (!formData.selectedTaskID && !formData.taskTitle) {
            toast.error("Please enter a task title");
            return;
        }

        try {
            if (formData.selectedTaskID) {
                // Log as comment to existing task
                await saveCommentMutation.mutateAsync({
                    taskCommentIDP: 0,
                    taskIDF: formData.selectedTaskID,
                    commentText: formData.taskDescription || `Logged time for ${actionType}`,
                    isSystemGenerated: false,
                    actualSeconds: seconds,
                    taskTypeIDF: lookups?.taskTypes.find(t => t.taskTypeName?.toLowerCase() === actionType.toLowerCase())?.taskTypeIDP || lookups?.taskTypes[0]?.taskTypeIDP || 0,
                    assignToIDF: formData.assignToIDF || Number(user?.userIDP) || 0
                } as any);
                toast.success('Time logged to existing task!');
            } else {
                // Create new task
                const actualMinutes = Math.ceil(seconds / 60);
                const now = new Date().toISOString();
                
                await saveTaskMutation.mutateAsync({
                    taskIDP: 0,
                    projectIDF: formData.projectIDF,
                    taskTitle: formData.taskTitle,
                    taskDescription: formData.taskDescription,
                    taskTypeIDF: lookups?.taskTypes.find(t => t.taskTypeName?.toLowerCase() === actionType.toLowerCase())?.taskTypeIDP || lookups?.taskTypes[0]?.taskTypeIDP || 0,
                    taskStatusIDF: lookups?.statuses.find(s => ['completed', 'closed', 'done'].includes(s.taskStatus.toLowerCase()))?.taskStatusIDP || lookups?.statuses[0]?.taskStatusIDP || 0,
                    priorityIDF: lookups?.priorities.find(p => p.priorityName.toLowerCase() === 'high')?.priorityIDP || lookups?.priorities[0]?.priorityIDP || 0,
                    assignToIDF: formData.assignToIDF || Number(user?.userIDP) || 0,
                    assignByIDF: Number(user?.userIDP) || 0,
                    startDate: now,
                    deadlineDate: now,
                    actualHours: actualMinutes,
                    progressPercent: 100,
                    isBlocked: false,
                    blockReason: ''
                } as any);
                toast.success('New task created from session!');
            }

            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to synchronize session results.");
        }
    };

    if (!isOpen) return null;

    const projectOptions = (lookups?.projects || []).map(p => ({ value: p.projectIDP, label: p.projectName }));
    const userOptions = (projectMembers || []).map((u: any) => ({ value: u.userIDP, label: u.userName }));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Clock className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                {view === 'timer' ? `${actionType} ACTIVE` : `FINALIZE ${actionType.toUpperCase()}`}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
                                Operational Vector Synchronization
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {view === 'timer' ? (
                        <div className="flex flex-col items-center py-8">
                            <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-8" />
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 px-6 py-2 bg-gray-50 rounded-full">Elapsed Duration</div>
                            <div className="text-6xl font-black text-gray-900 font-mono tracking-tighter mb-12">
                                {formatTime(seconds)}
                            </div>

                            <button
                                onClick={handleStopClick}
                                className="w-full group relative bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-rose-600/20 active:scale-95"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <Square size={24} fill="white" className="group-hover:scale-110 transition-transform"/>
                                    TERMINATE & SAVE
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Select Project Context</label>
                                    <Select 
                                        options={projectOptions} 
                                        onChange={(opt: any) => setFormData(p => ({...p, projectIDF: opt?.value || 0}))}
                                        placeholder="Project Cluster..."
                                        styles={selectStyles}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Node Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-4 text-gray-300" size={18} />
                                        <input 
                                            value={formData.taskTitle}
                                            onChange={(e) => setFormData(p => ({...p, taskTitle: e.target.value}))}
                                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="Descriptive reference..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Operational Feedback</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-4 top-4 text-gray-300" size={18} />
                                        <textarea 
                                            rows={3}
                                            value={formData.taskDescription}
                                            onChange={(e) => setFormData(p => ({...p, taskDescription: e.target.value}))}
                                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                                            placeholder="What were the outcomes?"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Assign Result to Node</label>
                                    <Select 
                                        options={userOptions} 
                                        onChange={(opt: any) => setFormData(p => ({...p, assignToIDF: opt?.value || 0}))}
                                        placeholder="Team Member..."
                                        styles={selectStyles}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setView('timer')}
                                    className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    BACK TO TIMER
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-black shadow-2xl hover:scale-[1.02] transition-all"
                                >
                                    SYNCHRONIZE TO SYSTEM
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const selectStyles = {
    control: (base: any) => ({
        ...base,
        padding: '0.4rem 0.8rem',
        borderRadius: '0.75rem',
        backgroundColor: '#f9fafb',
        border: 'none',
        fontWeight: '700',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: '#f3f4f6'
        }
    }),
    placeholder: (base: any) => ({
        ...base,
        color: '#d1d5db',
        fontSize: '14px'
    })
};
