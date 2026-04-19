import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Check, Save, Layers, Edit2, User, AlertCircle, Calendar } from 'lucide-react';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnLink, BtnClearFormatting } from 'react-simple-wysiwyg';
import Select from 'react-select';
import { useTask, useSaveTask, useTaskLookups, useProjectUsers } from '../hooks/queries/task.queries';
import { toast } from '@/utils/toast.utils';
import type { ProjectLookupModel, UserLookupModel, StatusLookupModel } from '../types/task.types';
import { taskSchema, type TaskFormValues } from '../validation/task.validation';
import { useAuth } from '@/providers/auth-provider';

const getPriorityColor = (name: string, isSelected: boolean) => {
  if (!isSelected) return 'bg-white text-gray-500 border-gray-100 hover:border-gray-300';
  const n = (name || '').toLowerCase();
  if (n.includes('critical') || n.includes('high')) return 'bg-green-500 text-white border-green-500 shadow-md';
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

export const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const taskId = parseInt(id || '0');

  const { user } = useAuth();
  const { data: task, isLoading: isFetching } = useTask(taskId);
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
    if (task) {
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
    }
  }, [task, reset]);

  const onFormSubmit = async (formData: TaskFormValues) => {
    try {
      if (!formData.projectIDF) { toast.error("Please select a project."); return; }
      if (!formData.taskStatusIDF) { toast.error("Status is required."); return; }
      if (!formData.priorityIDF) { toast.error("Priority is required."); return; }
      if (!formData.taskTypeIDF) { toast.error("Type is required."); return; }

      await saveMutation.mutateAsync({
        ...formData,
        taskIDP: isEditing ? taskId : 0,
        assignByIDF: Number(user?.userIDP) || 0,
      });
      toast.success('Saved!');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleBack = () => navigate('/tasks');

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

  useEffect(() => {
    // When project changes, clear assignee if we're not in the middle of loading an existing task
    if (watchProjectIDF && !isFetching && !task) {
      // Only reset if the current assignee is not part of the new project members
      // Or just reset for simplicity like V1
      setValue('assignToIDF', 0);
    }
  }, [watchProjectIDF, isFetching, task, setValue]);

  const progressOptions = [];
  for (let i = 0; i <= 100; i += 10) {
    progressOptions.push({ value: i, label: `${i}%` });
  }

  if ((isEditing && isFetching) || isLoadingLookups) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-start p-4 bg-gray-50/50">
      <div className="relative w-full h-full bg-white rounded-xl shadow-xl border border-gray-200 text-left overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className='flex items-center gap-4'>
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg">
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
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-all text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onFormSubmit)}
              disabled={saveMutation.isPending}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save size={16} /> Save Task
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT COLUMN: Projects */}
          <div className="w-64 md:w-1/5 max-w-sm border-r border-gray-100 bg-gray-50/50 flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-gray-100 bg-white flex-shrink-0">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">SELECT PROJECT</h3>
              <div className="relative">
                <Search className="absolute left-4 top-3 text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {errors.projectIDF && <p className="text-xs text-red-500 mt-3 flex items-center gap-1.5 font-bold"><AlertCircle size={14} /> {errors.projectIDF.message}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {filteredProjects.map((p: ProjectLookupModel) => (
                <button
                  key={p.projectIDP}
                  onClick={() => setValue('projectIDF', p.projectIDP, { shouldValidate: true })}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${watchProjectIDF === p.projectIDP
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <div className="truncate text-xs font-semibold">{p.projectName}</div>
                  {watchProjectIDF === p.projectIDP && <Check size={16} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN: Main Form */}
          <div className="flex-1 bg-white overflow-hidden flex flex-col relative min-w-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8 pr-2">

              {/* Title & Desc */}
              <div className='space-y-4'>
                <div>
                  <input
                    type="text"
                    {...register('taskTitle')}
                    className={`w-full text-2xl font-bold border-b border-gray-200 py-4 focus:ring-0 focus:border-indigo-600 bg-transparent placeholder:text-gray-300 transition-all focus:outline-none ${errors.taskTitle ? 'border-red-300 text-red-500' : 'text-gray-900'}`}
                    placeholder="Enter Task Title Here..."
                  />
                  {errors.taskTitle && <p className="text-xs text-red-500 mt-2 font-semibold uppercase">{errors.taskTitle.message}</p>}
                </div>

                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-inner overflow-hidden">
                  <Controller
                    name="taskDescription"
                    control={control}
                    render={({ field }) => (
                      <EditorProvider>
                        <Editor
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{ minHeight: '200px', overflowY: 'auto' }}
                          placeholder="Add a detailed description..."
                        >
                          <Toolbar>
                            <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnStrikeThrough /> <BtnLink /> <BtnClearFormatting />
                          </Toolbar>
                        </Editor>
                      </EditorProvider>
                    )}
                  />
                </div>
              </div>

              {/* Unified Grid: Dates, Hours, Progress */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <InputWrapper label="Start Date" icon={Calendar}>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm h-[42px] focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </InputWrapper>
                <InputWrapper label="Deadline" icon={Calendar}>
                  <input
                    type="date"
                    {...register('deadlineDate')}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm h-[42px] focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </InputWrapper>
                <InputWrapper label="Est. Hours">
                  <input
                    type="number"
                    {...register('estimatedHours', { valueAsNumber: true })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm h-[42px] focus:outline-none focus:border-blue-500 transition-all"
                  />
                </InputWrapper>
                <InputWrapper label="Act. Hours">
                  <input
                    type="number"
                    {...register('actualHours', { valueAsNumber: true })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm h-[42px] focus:outline-none focus:border-blue-500 transition-all"
                  />
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
                        className="text-sm"
                        classNamePrefix="select"
                        placeholder="0%"
                        isSearchable={false}
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            minHeight: '40px',
                            height: '40px',
                            backgroundColor: '#fff',
                            borderColor: '#E5E7EB',
                            borderRadius: '0.5rem',
                          })
                        }}
                      />
                    )}
                  />
                </InputWrapper>
              </div>

              {/* Blocking */}
              <div className="bg-[#fff1f2] rounded-xl p-3 border border-red-100 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="form-check form-switch cursor-pointer">
                    <input type="checkbox" className="sr-only" {...register('isBlocked')} id="blockToggle" />
                    <label htmlFor="blockToggle" className={`relative inline-flex items-center cursor-pointer w-10 h-5 rounded-full transition-colors focus:outline-none ${watchIsBlocked ? 'bg-red-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${watchIsBlocked ? 'translate-x-6' : 'translate-x-1'} `} />
                    </label>
                  </div>
                  <span className={`text-[11px] font-bold ${watchIsBlocked ? 'text-red-700' : 'text-gray-500'}`}>Blocked</span>
                </div>
                {watchIsBlocked && (
                  <input
                    type="text"
                    {...register('blockReason')}
                    placeholder="Reason for blocking..."
                    className="flex-1 bg-white border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 placeholder:text-red-200 focus:outline-none focus:border-red-400"
                  />
                )}
              </div>

              {/* Team Assignment */}
              <div className="pt-6 border-t border-gray-50">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 border-b border-gray-100 pb-2">
                  ASSIGN TEAM
                </label>
                {watchProjectIDF ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoadingMembers ? (
                      <div className="col-span-4 p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-100 animate-pulse text-[10px] font-black uppercase text-gray-300">
                        Synchronizing Project Capacity...
                      </div>
                    ) : (projectMembers || []).length > 0 ? (
                      (projectMembers || []).map((u: any) => {
                        const isSelected = watchAssignToIDF === u.userIDP;
                        return (
                          <div
                            key={u.userIDP}
                            onClick={() => handleUserToggle(u)}
                            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 ${isSelected
                              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
                              : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                              {(u.userName || '?').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                {u.userName}
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Consultant</span>
                            </div>
                            {isSelected && <Check size={14} className="ml-auto text-blue-600" />}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 text-xs font-bold italic col-span-3 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center uppercase">
                        No operational team members found for this project cluster.
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Phase 1: Select a project to visualize team capacity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Attributes */}
          <div className="w-72 border-l border-gray-100 bg-gray-50 flex flex-col flex-shrink-0 overflow-hidden">

            {/* Task Type */}
            <div className="flex-1 flex flex-col border-b border-gray-100 min-h-0 bg-white">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider p-6 pb-2">TASK TYPE</h3>
              <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {lookups?.taskTypes.map((t: any) => (
                    <button
                      key={t.taskTypeIDP}
                      type="button"
                      onClick={() => setValue('taskTypeIDF', t.taskTypeIDP, { shouldValidate: true })}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${watchTaskTypeIDF === t.taskTypeIDP
                        ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {t.taskTypeName || t.taskType}
                    </button>
                  ))}
                  {errors.taskTypeIDF && <p className="text-[10px] font-bold text-red-500 w-full mt-1 uppercase">{errors.taskTypeIDF.message}</p>}
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="flex-1 flex flex-col border-b border-gray-100 min-h-0 bg-white">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 pb-2">PRIORITY</h3>
              <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {lookups?.priorities.map((p: any) => {
                    const isSelected = watchPriorityIDF === p.priorityIDP;
                    return (
                      <button
                        key={p.priorityIDP}
                        type="button"
                        onClick={() => setValue('priorityIDF', p.priorityIDP, { shouldValidate: true })}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${getPriorityColor(p.priorityName, isSelected)}`}
                      >
                        {p.priorityName}
                      </button>
                    )
                  })}
                  {errors.priorityIDF && <p className="text-[10px] font-bold text-red-500 w-full mt-1 uppercase">{errors.priorityIDF.message}</p>}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 pb-2">STATUS</h3>
              <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {lookups?.statuses.map((s: StatusLookupModel) => (
                    <button
                      key={s.taskStatusIDP}
                      type="button"
                      onClick={() => setValue('taskStatusIDF', s.taskStatusIDP, { shouldValidate: true })}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${watchTaskStatusIDF === s.taskStatusIDP
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {s.taskStatus}
                    </button>
                  ))}
                  {errors.taskStatusIDF && <p className="text-[10px] font-bold text-red-500 w-full mt-1 uppercase">{errors.taskStatusIDF.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
