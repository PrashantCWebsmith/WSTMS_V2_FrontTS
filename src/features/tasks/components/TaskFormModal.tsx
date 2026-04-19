import React, { useEffect, useState, useMemo } from 'react';
import { X, Search, Check, Save, Layers, AlertCircle, Calendar } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnLink, BtnClearFormatting } from 'react-simple-wysiwyg';
import Select from 'react-select';
import { useTask, useSaveTask, useTaskLookups, useProjectUsers } from '../hooks/queries/task.queries';
import Swal from 'sweetalert2';
import { toast } from '@/utils/toast.utils';
import { taskSchema, type TaskFormValues } from '../validation/task.validation';
import { useAuth } from '@/providers/auth-provider';
import type { ProjectLookupModel, StatusLookupModel } from '../types/task.types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: number;
}

const getPriorityColor = (name: string, isSelected: boolean) => {
  if (!isSelected) return 'bg-white text-gray-500 border-gray-100 hover:border-gray-300';
  const n = (name || '').toLowerCase();
  if (n.includes('critical') || n.includes('high')) return 'bg-red-500 text-white border-red-500 shadow-md';
  if (n.includes('medium')) return 'bg-yellow-500 text-white border-yellow-500 shadow-md';
  return 'bg-blue-500 text-white border-blue-500 shadow-md';
};

const InputWrapper = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon?: any }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-2.5 text-gray-400" size={16} />}
      {children}
    </div>
  </div>
);

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, taskId }) => {
  const isEditing = !!taskId && taskId > 0;
  const { user } = useAuth();
  const { data: task, isLoading: isFetching } = useTask(taskId || 0);
  const { data: lookups, isLoading: isLoadingLookups } = useTaskLookups();
  const saveMutation = useSaveTask();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      taskIDP: 0,
      taskTitle: '',
      taskDescription: '',
      projectIDF: 0,
      taskStatusIDF: 0,
      taskTypeIDF: 0,
      priorityIDF: 0,
      assignToIDF: 0,
      deadlineDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: 0,
      actualHours: 0,
      progressPercent: 0,
      isBlocked: false,
      blockReason: '',
      remarks: '',
    },
  });

  const watchProjectIDF = watch('projectIDF');
  const watchAssignToIDF = watch('assignToIDF');
  const watchTaskTypeIDF = watch('taskTypeIDF');
  const watchPriorityIDF = watch('priorityIDF');
  const watchTaskStatusIDF = watch('taskStatusIDF');
  const watchIsBlocked = watch('isBlocked');

  const { data: projectMembers, isLoading: isLoadingMembers } = useProjectUsers(watchProjectIDF);

  useEffect(() => {
    if (isOpen && task && isEditing) {
      reset({
        taskIDP: task.taskIDP,
        taskTitle: task.taskTitle,
        taskDescription: task.taskDescription,
        projectIDF: task.projectIDF,
        taskStatusIDF: task.taskStatusIDF,
        taskTypeIDF: task.taskTypeIDF,
        priorityIDF: task.priorityIDF,
        assignToIDF: task.assignToIDF,
        deadlineDate: task.deadlineDate ? new Date(task.deadlineDate).toISOString().split('T')[0] : '',
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        progressPercent: task.progressPercent || 0,
        isBlocked: task.isBlocked || false,
        blockReason: task.blockReason || '',
        remarks: task.remarks || '',
      });
    } else if (isOpen && !isEditing) {
      reset({
        taskIDP: 0,
        taskTitle: '',
        taskDescription: '',
        projectIDF: 0,
        taskStatusIDF: 0,
        taskTypeIDF: 0,
        priorityIDF: 0,
        assignToIDF: 0,
        deadlineDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        estimatedHours: 0,
        actualHours: 0,
        progressPercent: 0,
        isBlocked: false,
        blockReason: '',
        remarks: '',
      });
    }
  }, [isOpen, task, isEditing, reset]);

  const onFormSubmit = async (formData: TaskFormValues) => {
    try {
      if (!formData.projectIDF) { 
          Swal.fire("Error", "Please select a project.", "error"); 
          return; 
      }
      
      await saveMutation.mutateAsync({
        ...formData,
        taskIDP: isEditing ? (taskId || 0) : 0,
        assignByIDF: Number(user?.userIDP) || 0,
      });
      toast.success('Saved!');
      onClose();
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  const filteredProjects = useMemo(() => {
    if (!lookups?.projects) return [];
    return lookups.projects.filter((p: ProjectLookupModel) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lookups, searchTerm]);

  const handleUserToggle = (u: any) => {
    const isSelected = watchAssignToIDF === u.userIDP;
    setValue('assignToIDF', isSelected ? 0 : u.userIDP, { shouldValidate: true });
  };

  const progressOptions = [];
  for (let i = 0; i <= 100; i += 10) {
    progressOptions.push({ value: i, label: `${i}%` });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden="true"></div>

        <div className="relative inline-block align-bottom bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-[90vw] sm:w-[1200px] h-[85vh] flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
            <div className='flex items-center gap-4'>
                <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
                    <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {isEditing ? `Edit Task #${task?.taskNo}` : 'Create New Task'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isEditing ? 'Update task details and maintain workflow integrity' : 'Capture requirements and assign to the right personnel'}
                  </p>
                </div>
            </div>
            <div className='flex items-center gap-3'>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 cursor-pointer">
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-1 min-h-0 overflow-hidden">
            {/* LEFT COLUMN: Projects */}
            <div className="w-64 border-r border-gray-100 bg-gray-50/50 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-gray-100 bg-white">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">SELECT PROJECT</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Filter..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:bg-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredProjects.map((p: ProjectLookupModel) => (
                  <button
                    key={p.projectIDP}
                    type="button"
                    onClick={() => setValue('projectIDF', p.projectIDP, { shouldValidate: true })}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${watchProjectIDF === p.projectIDP
                      ? 'bg-indigo-600 text-white shadow-md font-bold'
                      : 'hover:bg-gray-100 text-gray-600'
                      }`}
                  >
                    <div className="truncate text-xs font-semibold">{p.projectName}</div>
                    {watchProjectIDF === p.projectIDP && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN: Main Form */}
            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6 space-y-8">
                {isFetching ? (
                   <div className="flex items-center justify-center h-full">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                   </div>
                ) : (
                    <>
                        {/* Title */}
                        <div>
                          <input
                            type="text"
                            {...register('taskTitle')}
                            className={`w-full text-2xl font-bold border-b border-gray-200 py-3 focus:ring-0 focus:border-indigo-600 bg-transparent placeholder:text-gray-200 transition-all focus:outline-none ${errors.taskTitle ? 'border-red-300' : 'text-gray-900'}`}
                            placeholder="Enter Task Title..."
                          />
                          {errors.taskTitle && <p className="text-[10px] text-red-500 mt-1 font-bold uppercase">{errors.taskTitle.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-inner overflow-hidden min-h-[200px]">
                            <Controller
                                name="taskDescription"
                                control={control}
                                render={({ field }) => (
                                <EditorProvider>
                                    <Editor
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    style={{ minHeight: '180px' }}
                                    >
                                    <Toolbar>
                                        <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnLink /> <BtnClearFormatting />
                                    </Toolbar>
                                    </Editor>
                                </EditorProvider>
                                )}
                            />
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <InputWrapper label="Start Date" icon={Calendar}>
                                <input type="date" {...register('startDate')} className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500 h-[38px]" />
                            </InputWrapper>
                            <InputWrapper label="Deadline" icon={Calendar}>
                                <input type="date" {...register('deadlineDate')} className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500 h-[38px]" />
                            </InputWrapper>
                            <InputWrapper label="Est. Hours">
                                <input type="number" {...register('estimatedHours', { valueAsNumber: true })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 h-[38px]" />
                            </InputWrapper>
                            <InputWrapper label="Act. Hours">
                                <input type="number" {...register('actualHours', { valueAsNumber: true })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 h-[38px]" />
                            </InputWrapper>
                            <InputWrapper label="Progress">
                                <Controller
                                    name="progressPercent"
                                    control={control}
                                    render={({ field }) => (
                                    <Select
                                        options={progressOptions}
                                        value={progressOptions.find(o => o.value === field.value)}
                                        onChange={(opt: any) => field.onChange(opt.value)}
                                        className="text-xs"
                                        classNamePrefix="select"
                                        placeholder="0%"
                                        isSearchable={false}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '38px',
                                                height: '38px',
                                                borderRadius: '0.5rem',
                                                borderColor: '#E5E7EB'
                                            })
                                        }}
                                    />
                                    )}
                                />
                            </InputWrapper>
                        </div>

                        {/* Team */}
                        <div className="pt-6 border-t border-gray-50">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">ASSIGN TEAM</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {isLoadingMembers ? (
                                    <div className="col-span-full py-4 text-center animate-pulse text-xs text-gray-400">Loading team...</div>
                                ) : (projectMembers || []).map((u: any) => {
                                    const isSelected = watchAssignToIDF === u.userIDP;
                                    return (
                                        <div
                                            key={u.userIDP}
                                            onClick={() => handleUserToggle(u)}
                                            className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center gap-3 ${isSelected ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                {(u.userName || '?').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>{u.userName}</span>
                                            </div>
                                            {isSelected && <Check size={12} className="ml-auto text-indigo-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* RIGHT COLUMN: Attributes */}
            <div className="w-72 border-l border-gray-100 flex flex-col flex-shrink-0 bg-white">
                <div className="p-4 border-b border-gray-100 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">TASK TYPE</h3>
                        <div className="flex flex-wrap gap-2">
                            {lookups?.taskTypes.map((t: any) => (
                                <button
                                    key={t.taskTypeIDP}
                                    type="button"
                                    onClick={() => setValue('taskTypeIDF', t.taskTypeIDP, { shouldValidate: true })}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${watchTaskTypeIDF === t.taskTypeIDP ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                >
                                    {t.taskTypeName || t.taskType}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">PRIORITY</h3>
                        <div className="flex flex-wrap gap-2">
                            {lookups?.priorities.map((p: any) => (
                                <button
                                    key={p.priorityIDP}
                                    type="button"
                                    onClick={() => setValue('priorityIDF', p.priorityIDP, { shouldValidate: true })}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${getPriorityColor(p.priorityName, watchPriorityIDF === p.priorityIDP)}`}
                                >
                                    {p.priorityName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">STATUS</h3>
                        <div className="flex flex-wrap gap-2">
                            {lookups?.statuses.map((s: any) => (
                                <button
                                    key={s.taskStatusIDP}
                                    type="button"
                                    onClick={() => setValue('taskStatusIDF', s.taskStatusIDP, { shouldValidate: true })}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${watchTaskStatusIDF === s.taskStatusIDP ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                >
                                    {s.taskStatus}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={18} /> {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all text-sm font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
