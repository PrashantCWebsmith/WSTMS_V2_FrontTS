import React, { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft,
  AlertTriangle,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  useIncident,
  useSaveIncident
} from '../hooks/queries/incident.queries';
import { useProjects } from '@/features/projects/hooks/queries/project.queries';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incidentSchema, type IncidentFormValues } from '../validation/incident.validation';
import { toast } from '@/utils/toast.utils';
import { cn } from '@/utils/cn';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnLink, BtnClearFormatting } from 'react-simple-wysiwyg';
import { useAuth } from '@/providers/auth-provider';

export const IncidentForm: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const incidentId = Number(id);

  const { data: incidentData, isLoading: isLoadingData } = useIncident(incidentId);
  const { data: projectsData } = useProjects({ page: 1, size: 100 });
  const saveMutation = useSaveIncident();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      projectIDF: 0,
      taskIDF: 0,
      userIDF: Number(user?.userIDP) || 0,
      criticalPoint: '',
      nonCriticalPoint: '',
      severity: 'Medium',
      incidentDate: new Date(),
      status: 'Open'
    }
  });

  useEffect(() => {
    if (incidentData) {
      reset({ 
        projectIDF: incidentData.projectIDF,
        taskIDF: incidentData.taskIDF || 0,
        userIDF: incidentData.userIDF,
        criticalPoint: incidentData.criticalPoint || '',
        nonCriticalPoint: incidentData.nonCriticalPoint || '',
        severity: incidentData.severity || 'Medium',
        incidentDate: incidentData.incidentDate ? new Date(incidentData.incidentDate) : new Date(),
        status: incidentData.status || 'Open'
      });
    }
  }, [incidentData, reset]);

  const onFormSubmit = async (values: IncidentFormValues) => {
    try {
      await saveMutation.mutateAsync({
        incidentIDP: isEditing ? incidentId : 0,
        ...values,
        incidentDate: values.incidentDate.toISOString()
      });
      toast.success(`Incident ${isEditing ? 'updated' : 'reported'} successfully`);
      navigate('/incidents');
    } catch (error) {
      toast.error('Failed to save incident');
    }
  };

  const projects = useMemo(() => {
    const rawProjects = projectsData?.data || [];
    return rawProjects.map((p: any) => ({ value: p.projectIDP, label: p.projectName }));
  }, [projectsData]);

  if (isEditing && isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
            {isEditing ? 'Edit Incident' : 'New Incident'}
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">
            {isEditing ? 'Update critical project observation' : 'Record a new blocker or critical observation'}
          </p>
        </div>
        <button
          onClick={() => navigate('/incidents')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <Controller
                name="projectIDF"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    label="Project"
                    options={projects}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.projectIDF?.message}
                    placeholder="Select Project"
                  />
                )}
              />
            </div>
            
            <div className="space-y-1">
              <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    label="Severity"
                    options={[
                      { value: 'Low', label: 'Low' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'High', label: 'High' },
                      { value: 'Critical', label: 'Critical' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Severity"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-0.5">Incident Date</label>
              <div className="relative">
                <Controller
                  name="incidentDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all pl-10"
                    />
                  )}
                />
                <CalendarIcon size={16} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Status"
                  options={[
                    { value: 'Open', label: 'Open' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Status"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
                Critical Points
              </label>
              <div className={cn(
                "border rounded-[2rem] overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 transition-all",
                errors.criticalPoint ? "border-red-500" : "border-gray-100 shadow-sm"
              )}>
                <Controller
                  name="criticalPoint"
                  control={control}
                  render={({ field }) => (
                    <EditorProvider>
                      <Editor
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="min-h-[250px] text-sm"
                      >
                        <Toolbar>
                          <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnLink /> <BtnClearFormatting />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  )}
                />
              </div>
              {errors.criticalPoint && <p className="text-xs text-red-500 ml-2">{errors.criticalPoint.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
                Non-Critical Points
              </label>
              <div className="border border-gray-100 rounded-[2rem] overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
                <Controller
                  name="nonCriticalPoint"
                  control={control}
                  render={({ field }) => (
                    <EditorProvider>
                      <Editor
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="min-h-[250px] text-sm"
                      >
                        <Toolbar>
                          <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnLink /> <BtnClearFormatting />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
               type="button"
               onClick={() => navigate('/incidents')}
               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={20} />
              {isEditing ? 'Update Record' : 'Submit Incident'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .react-select-container .react-select__control {
          border-radius: 1rem;
          border-color: #f1f5f9 !important;
          padding: 6px;
          font-size: 0.875rem;
          background-color: #f8fafc;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
};
