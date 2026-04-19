import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Clock,
    ArrowLeft,
    Save
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { useAuth } from '@/providers/auth-provider';
import { useTaskLookups, useSaveTask } from '@/features/tasks/hooks/queries/task.queries';
import { useSaveTaskComment } from '@/features/tasks/hooks/queries/task-comment.queries';
import { TaskService } from '@/features/tasks/services/task.service';
import type { TaskViewModel } from '@/features/tasks/types/task.types';
import { toast } from '@/utils/toast.utils';

export const LogSession: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const type = searchParams.get('type') || 'Unknown';
    const secondsStr = searchParams.get('seconds') || '0';
    const seconds = parseInt(secondsStr);

    // Lookups - Migrated to new hooks/queries
    const { data: lookups } = useTaskLookups();
    const [projectTasks, setProjectTasks] = useState<TaskViewModel[]>([]);

    const saveTaskMutation = useSaveTask();
    const saveCommentMutation = useSaveTaskComment();

    // Form State
    const [projectIDF, setProjectIDF] = useState<number>(0);
    const [selectedTaskID, setSelectedTaskID] = useState<number>(0);
    const [taskTitle, setTaskTitle] = useState(`${type} - ${new Date().toLocaleDateString()}`);
    const [description, setDescription] = useState('');
    const [assignToIDF, setAssignToIDF] = useState<number>(Number(user?.userIDP) || 0);

    const [isSaving, setIsSaving] = useState(false);

    // Load tasks when project changes
    useEffect(() => {
        if (projectIDF) {
            TaskService.getProjectWise(projectIDF).then(setProjectTasks);
        } else {
            setProjectTasks([]);
        }
    }, [projectIDF]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectIDF) {
            toast.error('Please select a project pipeline');
            return;
        }

        setIsSaving(true);
        try {
            if (selectedTaskID) {
                // Save as Comment (V1 Logic Parity)
                const foundType = lookups?.taskTypes.find((t: any) =>
                    (t.taskTypeName || t.taskType || '').toLowerCase() === type.toLowerCase()
                );

                const payload = {
                    taskCommentIDP: 0,
                    taskIDF: selectedTaskID,
                    commentText: description || `Logged time for ${type}`,
                    comment: description || `Logged time for ${type}`,
                    isSystemGenerated: false,
                    ActualSeconds: seconds,
                    TaskTypeIDF: foundType?.taskTypeIDP || 0,
                    AssignToIDF: assignToIDF || user?.userIDP
                };
                await saveCommentMutation.mutateAsync(payload);
            } else {
                // Save as New Task (V1 Logic Parity)
                const foundType = lookups?.taskTypes.find((t: any) =>
                    (t.taskTypeName || t.taskType || '').toLowerCase() === type.toLowerCase()
                );
                const foundPriority = lookups?.priorities.find((p: any) =>
                    (p.priorityName || p.priority || '').toLowerCase() === 'high'
                );
                const foundStatus = lookups?.statuses.find((s: any) => {
                    const name = (s.statusName || s.taskStatus || '').toLowerCase();
                    return name === 'closed' || name === 'completed' || name === 'done';
                });

                const actualMinutes = Math.ceil(seconds / 60);
                const payload = {
                    taskIDP: 0,
                    projectIDF: projectIDF,
                    taskTypeIDF: foundType?.taskTypeIDP || 0,
                    assignByIDF: Number(user?.userIDP) || 0,
                    assignToIDF: assignToIDF,
                    taskTitle: taskTitle,
                    taskDescription: description,
                    taskStatusIDF: foundStatus?.taskStatusIDP || 0,
                    priorityIDF: foundPriority?.priorityIDP || 0,
                    startDate: new Date().toISOString(),
                    deadlineDate: new Date().toISOString(),
                    estimatedHours: 0,
                    actualHours: actualMinutes,
                    progressPercent: 100,
                    isBlocked: false,
                    blockReason: ''
                };
                await saveTaskMutation.mutateAsync(payload as any);
            }

            toast.success('Session effort synchronized successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to preserve session log');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 max-w-4xl mx-auto pb-10">
            <PageHeader
                title="Sync Session Effort"
                description={`Finalize logs for the ${type} session.`}
                action={
                    <Button variant="outline" onClick={() => navigate('/')}>
                        <ArrowLeft size={18} className="mr-2" /> Discard Session
                    </Button>
                }
            />

            <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <form onSubmit={handleSave} className="space-y-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-900 rounded-xl text-white shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                                <Clock size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-widest">{type}</h2>
                                <p className="text-blue-200 text-xs font-bold opacity-70">Duration Recorded</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-5xl font-black font-mono tracking-tighter text-white">
                                {formatTime(seconds)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <SearchableSelect
                                label="Target Project Pipeline"
                                value={projectIDF}
                                onChange={(val) => setProjectIDF(Number(val))}
                                options={lookups?.projects.map((p: any) => ({ value: p.projectIDP, label: p.projectName })) || []}
                                required
                                placeholder="Select Pipeline..."
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <SearchableSelect
                                label="Link Existing Task (Optional)"
                                value={selectedTaskID}
                                onChange={(val) => {
                                    const id = Number(val);
                                    setSelectedTaskID(id);
                                    if (id) {
                                        const t = projectTasks.find(x => x.taskIDP === id);
                                        if (t) setTaskTitle(t.taskTitle);
                                    }
                                }}
                                options={[
                                    { value: 0, label: 'Create New Task From Session' },
                                    ...projectTasks.map((t: any) => ({
                                        value: t.taskIDP,
                                        label: `${t.taskTitle} [${t.taskNo}]`
                                    }))
                                ]}
                                disabled={!projectIDF}
                                placeholder="Search tasks..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Input
                                label="Session Title"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder="What did you achieve?"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Remarks & Effort Details</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                placeholder="Describe the specifics of this session..."
                            />
                        </div>

                        <SearchableSelect
                            label="Assign To (Confirmation)"
                            value={assignToIDF}
                            onChange={(val) => setAssignToIDF(Number(val))}
                            options={lookups?.users.map((u: any) => ({ value: u.userIDP, label: u.userFullName || u.userName })) || []}
                            disabled={!projectIDF}
                            placeholder="Select User"
                        />
                    </div>

                    <div className="flex gap-4 pt-10 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-500 font-black uppercase tracking-widest"
                            onClick={() => navigate('/')}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            className="flex-2 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xl shadow-indigo-500/20 font-black text-sm uppercase tracking-widest"
                            isLoading={isSaving}
                        >
                            <Save size={20} className="mr-2" />
                            Complete & Sync Log
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
