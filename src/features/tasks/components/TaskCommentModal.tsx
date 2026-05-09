import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/utils/toast.utils';
import { useSaveTaskComment } from '../hooks/queries/task-comment.queries';

interface TaskCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: number;
    taskNo?: string;
    onCommentSuccess?: () => void;
}

export const TaskCommentModal: React.FC<TaskCommentModalProps> = ({ isOpen, onClose, taskId, taskNo, onCommentSuccess }) => {
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const saveMutation = useSaveTaskComment();

    useEffect(() => {
        if (isOpen) {
            setCommentText('');
            setError(null);
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!commentText.trim()) {
            setError("Comment text cannot be empty.");
            return;
        }

        const payload = {
            taskCommentIDP: 0,
            taskIDF: taskId,
            commentText: commentText,
            isSystemGenerated: false,
            ActualSeconds: 0,
            TaskTypeIDF: 0,
            AssignToIDF: 0
        };

        try {
            await saveMutation.mutateAsync(payload);
            toast.success('Comment Added!');
            if (onCommentSuccess) onCommentSuccess();
            onClose();
        } catch (err: any) {
            console.error("Failed to save comment", err);
            setError(err.response?.data?.message || "Failed to save comment.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden="true"></div>

                <div className="relative inline-block align-bottom bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/20 animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Add Comment</h2>
                            <p className="text-sm text-gray-500 font-medium">Post a message to Task {taskNo ? `#${taskNo}` : ''}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Comment</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-white min-h-[120px] transition-all"
                                    placeholder="Write your comment here..."
                                    value={commentText}
                                    onChange={(e) => {
                                        setCommentText(e.target.value);
                                        if (error) setError(null);
                                    }}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm flex items-center gap-1 font-medium">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saveMutation.isPending || !commentText.trim()}
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm cursor-pointer"
                                >
                                    {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
