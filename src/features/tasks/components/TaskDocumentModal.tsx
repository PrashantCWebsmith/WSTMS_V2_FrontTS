import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Loader2, FileIcon } from 'lucide-react';
import { toast } from '@/utils/toast.utils';
import { useSaveTaskDocument } from '../hooks/queries/task-document.queries';

interface TaskDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: number;
    taskNo?: string;
    onUploadSuccess?: () => void;
}

export const TaskDocumentModal: React.FC<TaskDocumentModalProps> = ({ isOpen, onClose, taskId, taskNo, onUploadSuccess }) => {
    const [remarks, setRemarks] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const saveMutation = useSaveTaskDocument(taskId);

    useEffect(() => {
        if (isOpen) {
            setRemarks('');
            setSelectedFile(null);
            setError(null);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('File', selectedFile);
        formData.append('TaskIDF', taskId.toString());
        formData.append('Remarks', remarks || '');

        try {
            await saveMutation.mutateAsync(formData);
            toast.success('Document has been uploaded successfully');
            if (onUploadSuccess) onUploadSuccess();
            onClose();
        } catch (err: any) {
            console.error("Upload failed", err);
            toast.error(err.response?.data?.message || "An error occurred while uploading.");
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
                            <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
                            <p className="text-sm text-gray-500 font-medium">Add file for Task {taskNo ? `#${taskNo}` : ''}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select File</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {selectedFile ? (
                                            <>
                                                <FileIcon size={32} className="text-indigo-500 mb-2" />
                                                <p className="text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                                                <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Remarks (Optional)</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-white min-h-[100px] transition-all"
                                    placeholder="Add a description for this file..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm flex items-center gap-1 font-medium">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleUpload}
                                    disabled={saveMutation.isPending || !selectedFile}
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm cursor-pointer"
                                >
                                    {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    Upload File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
