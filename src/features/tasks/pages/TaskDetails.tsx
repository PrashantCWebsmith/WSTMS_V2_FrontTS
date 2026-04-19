import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    Tag,
    Clock,
    FileText,
    RefreshCw,
    Upload,
    MessageCircle,
    Download,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTaskDetailed } from '../hooks/queries/task.queries';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';
import { useSaveTaskDocument, useDeleteTaskDocument } from '../hooks/queries/task-document.queries';
import { TaskStatusModal } from '../components/TaskStatusModal';
import { TaskCommentModal } from '../components/TaskCommentModal';
import { TaskDocumentModal } from '../components/TaskDocumentModal';

export const TaskDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const taskId = parseInt(id || '0');

    const { data, isLoading, refetch } = useTaskDetailed(taskId);
    
    // Modal States
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    const deleteDocMutation = useDeleteTaskDocument(taskId);

    if (isLoading) {
        return (
            <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/30">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-8 w-3/4" />
                        </div>
                    </div>
                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data?.task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle className="text-red-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
                <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} /> Back to Tasks
                </button>
            </div>
        );
    }

    const { task, statusHistory, documents, comments, timeLogs } = data;

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const formatTime = (seconds?: number) => {
        if (!seconds) return '0h 0m 0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return `${h}h ${m}m ${s}s`;
    };

    const getPriorityColor = (priority?: string) => {
        const p = (priority || '').toLowerCase();
        if (p.includes('high')) return 'text-red-700 bg-red-50 border-red-200';
        if (p.includes('medium')) return 'text-amber-700 bg-amber-50 border-amber-200';
        if (p.includes('low')) return 'text-green-700 bg-green-50 border-green-200';
        return 'text-gray-700 bg-gray-50 border-gray-200';
    };

    const getStatusColor = (status?: string) => {
        const s = (status || '').toLowerCase();
        if (s.includes('complete')) return 'text-green-700 bg-green-50 border-green-200';
        if (s.includes('progress')) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (s.includes('hold')) return 'text-orange-700 bg-orange-50 border-orange-200';
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-1" />
                    <span className="text-sm font-medium">Back to Tasks</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-6 md:px-8 border-b border-gray-100 bg-gray-50/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold uppercase">
                                <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded">
                                    #{task.taskNo}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priorityName)}`}>
                                    {task.priorityName}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full border ${getStatusColor(task.taskStatus)}`}>
                                    {task.taskStatus}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {task.taskTitle}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-semibold cursor-pointer"
                            >
                                <RefreshCw size={15} /> Change Status
                            </button>
                            <button
                                onClick={() => setIsDocumentModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-semibold cursor-pointer"
                            >
                                <Upload size={15} /> Upload Document
                            </button>
                            <button
                                onClick={() => setIsCommentModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-semibold cursor-pointer"
                            >
                                <MessageCircle size={15} /> Add Comment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Description & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-blue-500" /> Description
                            </h3>
                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 text-gray-700 leading-relaxed min-h-[150px]">
                                {task.taskDescription ? (
                                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: task.taskDescription }} />
                                ) : (
                                    <span className="text-gray-400 italic text-sm">No description provided.</span>
                                )}
                            </div>
                        </section>

                        {/* Status History */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-blue-500" /> Activity History
                                <span className="ml-auto bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">{statusHistory?.length || 0} Logs</span>
                            </h3>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Movement</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">User</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {statusHistory?.length > 0 ? (
                                            statusHistory.map((h: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                       <p className="text-xs font-bold text-gray-800">
                                                          <span className="text-gray-400 font-medium">{h.oldStatus}</span> → <span className="text-blue-600">{h.newStatus}</span>
                                                       </p>
                                                       {h.remarks && <p className="text-[11px] text-gray-500 mt-0.5">{h.remarks}</p>}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-medium text-gray-600">{h.statusChangedByName}</td>
                                                    <td className="px-4 py-3 text-right text-[10px] text-gray-400 font-medium">{formatDate(h.createdDateTime)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={3} className="px-4 py-6 text-center text-xs text-gray-400 italic">No activity logs recorded.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Comments Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MessageCircle size={14} className="text-blue-500" /> Comments
                                <span className="ml-auto bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold">{comments?.length || 0} Total</span>
                            </h3>
                            <div className="space-y-4">
                                {comments?.length > 0 ? (
                                    comments.map((comment: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] border border-indigo-200 uppercase tracking-tighter">
                                                        {getInitials(comment.createdByName)}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">{comment.createdByName}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium">{formatDate(comment.createdDateTime)}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 whitespace-pre-wrap pl-8 leading-relaxed">{comment.commentText}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                                        <MessageCircle className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                                        <p className="text-xs text-gray-400 font-medium">No discussion threads found.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Time Logs Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-blue-500" /> Chronological Effort
                            </h3>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Operator</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Date</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase">Duration</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Work Summary</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {timeLogs?.length > 0 ? (
                                            timeLogs.map((log: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors text-xs">
                                                    <td className="px-4 py-3">
                                                       <div className="flex items-center gap-2">
                                                          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] font-black text-gray-400 uppercase">{getInitials(log.userName)}</div>
                                                          <span className="font-bold text-gray-700">{log.userName}</span>
                                                       </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-gray-500">{formatDate(log.startTime)}</td>
                                                    <td className="px-4 py-3 text-center">
                                                       <span className="font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-600">
                                                          {log.endTime ? formatTime((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 1000) : 'RUNNING'}
                                                       </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-500 italic max-w-xs truncate">{log.workDescription || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-gray-400 italic">No effort logs found for this task pipeline.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Meta Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Time Control Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <Clock size={12} /> Effort tracking
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-center items-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Estimated</p>
                                    <p className="text-sm font-bold text-gray-700 font-mono">
                                        {formatTime(task.estimatedHours * 60)}
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col justify-center items-center">
                                    <p className="text-[9px] font-bold text-indigo-400 uppercase mb-1">Actual</p>
                                    <p className="text-sm font-bold text-indigo-700 font-mono">
                                        {formatTime(task.actualHours * 60)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hierarchy Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <Tag size={12} /> Organizational context
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Project Cluster</p>
                                    <p className="font-bold text-gray-800 text-xs truncate" title={task.projectName}>{task.projectName}</p>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Task Category</p>
                                    <span className="inline-block px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-bold">{task.taskType}</span>
                                </div>
                            </div>
                        </div>

                        {/* People Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <User size={12} /> Personnel
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Lead Architect / Assigned</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] border border-blue-700 uppercase">
                                            {getInitials(task.assignTo)}
                                        </div>
                                        <p className="font-bold text-gray-800 text-xs">{task.assignTo}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Assigned By / Reporter</p>
                                    <div className="flex items-center gap-2 opacity-70">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-[8px] border border-gray-200 uppercase">
                                            {getInitials(task.assignBy)}
                                        </div>
                                        <p className="text-xs font-medium text-gray-600">{task.assignBy}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* timeline Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <Calendar size={12} /> Execution timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold uppercase text-[9px]">Genesis Date</span>
                                    <span className="font-bold text-gray-700 font-mono tracking-tighter">{formatDate(task.startDate)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100">
                                    <span className="text-gray-400 font-bold uppercase text-[9px]">Contractual Deadline</span>
                                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 font-mono tracking-tighter">
                                       <Calendar size={10} /> {formatDate(task.deadlineDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <FileText size={12} /> Project Assets
                                <span className="ml-auto bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-black">{documents?.length || 0} Files</span>
                            </h3>
                            {documents?.length > 0 ? (
                                <div className="space-y-2">
                                    {documents.map((doc: any, idx: number) => (
                                        <div key={idx} className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <FileText size={12} className="text-indigo-400 shrink-0" />
                                                <p className="text-xs font-bold text-gray-700 truncate" title={doc.documentName}>
                                                    {doc.documentName}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={doc.documentPath} target="_blank" className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Download size={12} /></a>
                                                <button 
                                                   onClick={async () => {
                                                  const res = await Swal.fire({
                                                      title: 'Delete document?',
                                                      text: 'This action is irreversible.',
                                                      icon: 'warning',
                                                      showCancelButton: true,
                                                      confirmButtonColor: '#ef4444', // red-500
                                                      confirmButtonText: 'Delete'
                                                  });
                                                      if(res.isConfirmed) {
                                                         try {
                                                            await deleteDocMutation.mutateAsync(doc.taskDocumentIDP);
                                                            toast.success('File purged from storage');
                                                         } catch(e) {
                                                            toast.error('Purge failed');
                                                         }
                                                      }
                                                   }}
                                                   className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                   <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">No project assets have been synchronized with this task segment yet.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Modals */}
            <TaskStatusModal 
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                task={task as any}
                onStatusChangeSuccess={refetch}
            />
            <TaskCommentModal 
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                taskId={taskId}
                taskNo={task.taskNo}
                onCommentSuccess={refetch}
            />
            <TaskDocumentModal 
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                taskId={taskId}
                taskNo={task.taskNo}
                onUploadSuccess={refetch}
            />
        </div>
    );
};
