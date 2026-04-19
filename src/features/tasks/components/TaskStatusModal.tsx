import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import Select from 'react-select';
import { toast } from '@/utils/toast.utils';
import { useTaskLookups, useSaveTask } from '../hooks/queries/task.queries';
import { useAuth } from '@/providers/auth-provider';
import type { TaskViewModel } from '../types/task.types';

interface TaskStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskViewModel;
    onStatusChangeSuccess?: () => void;
}

export const TaskStatusModal: React.FC<TaskStatusModalProps> = ({ isOpen, onClose, task, onStatusChangeSuccess }) => {
    const { user } = useAuth();
    const { data: lookups, isLoading: isLoadingLookups } = useTaskLookups();
    const saveMutation = useSaveTask();

    const [newStatusId, setNewStatusId] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && task) {
            setNewStatusId(task.taskStatusIDF || 0);
            setRemarks('');
            setError('');
        }
    }, [isOpen, task]);

    const handleSave = async () => {
        if (!newStatusId || newStatusId === 0) {
            setError("Please select a status.");
            return;
        }
        if (newStatusId === task.taskStatusIDF) {
            setError("Please select a different status.");
            return;
        }

        setError('');

        try {
            await saveMutation.mutateAsync({
                ...task,
                taskStatusIDF: newStatusId,
                remarks: remarks || "Status changed via Modal"
            } as any);

            toast.success('Status Updated');

            if (onStatusChangeSuccess) onStatusChangeSuccess();
            onClose();

        } catch (err) {
            console.error("Failed to update status", err);
            setError("Failed to update status. Please try again.");
            toast.error("Failed to update status");
        }
    };

    if (!isOpen) return null;

    const statusOptions = (lookups?.statuses || []).map(s => ({
        value: s.taskStatusIDP,
        label: s.taskStatus
    }));

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden="true"></div>

                <div className="relative inline-block align-bottom bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-white/20 animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Change Task Status</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(o => o.value === newStatusId)}
                                onChange={(opt) => setNewStatusId(opt ? opt.value : 0)}
                                isLoading={isLoadingLookups}
                                placeholder="Select Status"
                                className="text-sm"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.5rem',
                                        borderColor: '#E5E7EB',
                                        padding: '2px'
                                    })
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <textarea
                                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24"
                                placeholder="Add remarks about this change..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {saveMutation.isPending ? 'Updating...' : <><Save size={16} /> Update Status</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
