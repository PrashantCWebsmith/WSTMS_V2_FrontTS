import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Shield, 
    FileText, 
    Plus, 
    Trash2, 
    Upload, 
    Download, 
    Search,
    CheckCircle2
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useUser } from '../hooks/queries/user.queries';
import { 
    useUserAssignedProjects, 
    useSaveUserAssignedProject, 
    useDeleteUserAssignedProject 
} from '../hooks/queries/user-assigned-project.queries';
import { 
    useEmployeeDocuments, 
    useUploadEmployeeDocument, 
    useDeleteEmployeeDocument 
} from '../hooks/queries/employee-document.queries';
import { useTaskLookups } from '@/features/tasks/hooks/queries/task.queries';
import type { UserAssignedProjectViewModel } from '../types/user-assigned-project.types';
import type { EmployeeDocumentViewModel } from '../types/employee-document.types';
import type { ProjectLookupModel } from '@/features/tasks/types/task.types';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';

export const UserCenter: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = parseInt(id || '0');

    // Multi-Hook Data Fetching (Pro React Query usage)
    const { data: user, isLoading: loadingUser } = useUser(userId);
    const { data: lookups } = useTaskLookups();
    const { data: assignedProjects = [] } = useUserAssignedProjects(userId);
    const { data: documents = [] } = useEmployeeDocuments(userId);

    // Mutations
    const assignMutation = useSaveUserAssignedProject();
    const removeAssignMutation = useDeleteUserAssignedProject(userId);
    const uploadMutation = useUploadEmployeeDocument(userId);
    const deleteDocMutation = useDeleteEmployeeDocument(userId);

    const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'documents'>('profile');
    const [searchTerm, setSearchTerm] = useState('');

    // Document Upload State
    const [documentType, setDocumentType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isLatest, setIsLatest] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleAssignProject = async (projectId: number) => {
        try {
            await assignMutation.mutateAsync({
                assignProjectIDP: 0,
                userIDF: userId,
                projectIDF: projectId
            });
            toast.success('Project assigned successfully');
        } catch (error) {
            toast.error('Failed to assign project');
        }
    };

    const handleRemoveProject = async (assignmentId: number) => {
        const res = await Swal.fire({
            title: 'Remove Assignment?',
            text: 'User will lose access to this project.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove'
        });
        if (res.isConfirmed) {
            try {
                await removeAssignMutation.mutateAsync(assignmentId);
                toast.success('Assignment removed');
            } catch (error) {
                toast.error('Failed to remove assignment');
            }
        }
    };

    const handleDocUploadSubmit = async () => {
        if (!selectedFile || !documentType.trim()) return;

        const formData = new FormData();
        formData.append('File', selectedFile);
        formData.append('EmployeeDocumentIDP', '0');
        formData.append('UserIDF', userId.toString());
        formData.append('DocumentType', documentType);
        formData.append('IsLatest', isLatest.toString());
        formData.append('Remarks', remarks || '');

        try {
            await uploadMutation.mutateAsync(formData);
            toast.success('Asset synchronized successfully');
            // Reset form
            setSelectedFile(null);
            setDocumentType('');
            setRemarks('');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const handleDeleteDoc = async (docId: number) => {
        const res = await Swal.fire({
            title: 'Delete Asset?',
            text: 'This will be permanently removed from system storage.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete'
        });
        if (res.isConfirmed) {
            try {
                await deleteDocMutation.mutateAsync(docId);
                toast.success('Asset removed');
            } catch (error) {
                toast.error('Failed to delete asset');
            }
        }
    };

    if (loadingUser) return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const allProjects: ProjectLookupModel[] = lookups?.projects || [];
    const availableProjects = allProjects.filter(p => !assignedProjects.some((ap: UserAssignedProjectViewModel) => ap.projectIDF === p.projectIDP));
    const filteredAvailable = availableProjects.filter(p => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 max-w-7xl mx-auto pb-6">
            <PageHeader 
                title={user?.userFullName || user?.userName || 'User Profile'}
                description={user?.roleName || 'Employee Management Center'}
                action={<Button variant="outline" onClick={() => navigate('/users')}><ArrowLeft size={18} className="mr-2"/> Back</Button>}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-blue-500/5 p-6 text-center sticky top-24">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20">
                            {user?.userFullName?.substring(0, 1) || 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.userFullName}</h2>
                        <p className="text-sm font-semibold text-gray-400 mb-6">{user?.userName}</p>
                        
                        <div className="space-y-3 pt-6 border-t border-gray-50">
                             <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-400">Role</span>
                                <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{user?.roleName}</span>
                             </div>
                             <div className="flex items-center justify-between text-xs">
                                 <span className="font-bold text-gray-400">Status</span>
                                 <span className={`font-bold px-3 py-1 rounded-full ${user?.status ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                     {user?.status ? 'Active' : 'Inactive'}
                                 </span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9 space-y-4">
                    <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex gap-1 overflow-x-auto no-scrollbar">
                        {(['profile', 'projects', 'documents'] as const).map(tab => (
                            <button
                                 key={tab}
                                 onClick={() => setActiveTab(tab)}
                                 className={`px-8 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                     activeTab === tab 
                                     ? 'bg-gray-900 text-white shadow-xl' 
                                     : 'text-gray-500 hover:bg-gray-50'
                                 }`}
                             >
                                {tab === 'profile' && 'Network Access'}
                                {tab === 'projects' && 'Project Visibility'}
                                {tab === 'documents' && 'Personnel Assets'}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-blue-500/5 overflow-hidden min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="p-6 animate-in fade-in duration-300">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <Shield size={24} className="text-blue-600" /> Administrative Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Primary Identifier</p>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-700">
                                            {user?.userFullName}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Network Login</p>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-700">
                                            {user?.userName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'projects' && (
                            <div className="animate-in fade-in duration-300 bg-gray-50/30 flex h-[600px]">
                                <div className="w-1/2 p-6 border-r border-gray-100 flex flex-col">
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Search size={16} className="text-blue-500" />
                                            Available Portfolio
                                        </h4>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Filter projects..."
                                                className="w-full pl-6 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {filteredAvailable.map((p: ProjectLookupModel) => (
                                            <div key={p.projectIDP} className="p-4 bg-white rounded-2xl border border-gray-50 hover:border-blue-400 hover:shadow-lg transition-all flex items-center justify-between group">
                                                <span className="text-sm font-bold text-gray-700">{p.projectName}</span>
                                                <button 
                                                    disabled={assignMutation.isPending}
                                                    onClick={() => handleAssignProject(p.projectIDP)}
                                                    className="p-2 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/2 p-6 flex flex-col">
                                    <h4 className="text-sm font-black text-blue-600 mb-6 flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Assigned Projects ({assignedProjects.length})
                                    </h4>
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                        {assignedProjects.map((ap: UserAssignedProjectViewModel) => (
                                            <div key={ap.assignProjectIDP} className="p-4 bg-white rounded-2xl border-2 border-blue-50 shadow-sm flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-sm font-black text-gray-900">{ap.projectName}</span>
                                                </div>
                                                <button 
                                                    disabled={removeAssignMutation.isPending}
                                                    onClick={() => handleRemoveProject(ap.assignProjectIDP)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="p-6 animate-in fade-in duration-300 space-y-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Detailed Upload Form */}
                                    <div className="md:w-1/2 space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                                <Upload size={20} />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900">Push Secure Asset</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block ml-1">Asset Category</label>
                                                <input 
                                                    type="text"
                                                    placeholder="e.g. Identity Proof, Contract, Certificate"
                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
                                                    value={documentType}
                                                    onChange={(e) => setDocumentType(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block ml-1">Supplemental Remarks</label>
                                                <textarea 
                                                    rows={3}
                                                    placeholder="Provide additional context for this asset..."
                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm resize-none"
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Mark as Latest Version</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isLatest}
                                                        onChange={(e) => setIsLatest(e.target.checked)}
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div className="pt-2">
                                                <label className="cursor-pointer group">
                                                    <div className="w-full p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                                            <Upload size={24} className="text-blue-600" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-black text-gray-900">
                                                                {selectedFile ? selectedFile.name : 'Select Personnel File'}
                                                            </p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, PNG, JPG supported'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                                                    />
                                                </label>
                                            </div>

                                            <button 
                                                disabled={uploadMutation.isPending || !selectedFile || !documentType.trim()}
                                                onClick={handleDocUploadSubmit}
                                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <Shield size={18} />
                                                {uploadMutation.isPending ? 'Synchronizing Securely...' : 'Push to Global Storage'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Master Assets List */}
                                    <div className="md:w-1/2 space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900">Stored Assets ({documents.length})</h3>
                                        </div>

                                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                            {documents.length === 0 ? (
                                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                                                    <p className="text-sm font-bold text-gray-400">No assets registered for this user</p>
                                                </div>
                                            ) : (
                                                documents.map((doc: EmployeeDocumentViewModel, idx: number) => (
                                                    <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100 flex items-center justify-between hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                                <FileText size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-black text-gray-900">{doc.documentType || 'Personal Document'}</p>
                                                                    {doc.isLatest && <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full tracking-widest uppercase">Latest</span>}
                                                                </div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1 truncate max-w-[150px]" title={doc.originalFileName}>
                                                                    {doc.originalFileName || 'personnel_asset.pdf'}
                                                                </p>
                                                                {doc.remarks && <p className="text-[10px] text-blue-500 font-bold mt-1 line-clamp-1 italic">"{doc.remarks}"</p>}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <a 
                                                                href={doc.documentPath} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="p-3 text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Download size={18}/>
                                                            </a>
                                                            <button 
                                                                disabled={deleteDocMutation.isPending}
                                                                onClick={() => handleDeleteDoc(doc.employeeDocumentIDP)} 
                                                                className="p-3 text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={18}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
