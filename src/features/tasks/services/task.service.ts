import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type { 
  TaskViewModel, 
  TaskFilterModel, 
  TaskSaveModel, 
  TaskLookupsModel, 
  TaskDetailedViewModel,
  TaskModel
} from '@/features/tasks/types/task.types';

// Service for managing task-related API interactions.
export const TaskService = {
  // Fetch paginated tasks for display with optional filters.
  getAllPaging: async (params: PagingParamsModel, filters?: TaskFilterModel): Promise<PagedResultModel<TaskViewModel>> => {
    const payload = {
      pageNo: params.page,
      pageSize: params.size,
      projectIDF: filters?.projectIDF || 0,
      assignToIDF: filters?.assignToIDF || 0,
      taskStatusIDF: filters?.taskStatusIDF || 0,
      searchTerm: params.search || filters?.searchTerm || ''
    };
    const response = await api.post<PagedResultModel<TaskViewModel>>(`/Task/GetPaging`, payload);
    return response.data;
  },

  // Fetch a single task by ID for display or editing.
  getByID: async (id: number): Promise<TaskViewModel> => {
    const response = await api.get<TaskViewModel>(`/Task/Get/${id}`);
    return response.data;
  },

  // Fetch full task details including relations.
  getDetailed: async (id: number | string): Promise<TaskDetailedViewModel> => {
    const response = await api.get<TaskDetailedViewModel>(`/Task/GetTaskDetailed/${id}`);
    return response.data;
  },

  // Save or update a task entity.
  save: async (data: TaskSaveModel): Promise<TaskModel> => {
    const response = await api.post<TaskModel>('/Task/Save', data);
    return response.data;
  },

  // Delete a task by ID.
  delete: async (id: number): Promise<void> => {
    return TaskService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string, remarks?: string): Promise<void> => {
    await api.put(`/Task/Action`, { id, action, remarks });
  },

  // Fetch tasks filtered by project.
  getProjectWise: async (projectId: number): Promise<any[]> => {
    const response = await api.get(`/Task/GetProjectWiseTask/${projectId}`);
    const data = response.data as any;
    return data.data || data || [];
  },

  // Fetch all related lookup data in a single call.
  getLookups: async (): Promise<TaskLookupsModel> => {
    const [projects, statuses, types, priorities, users] = await Promise.all([
      api.get('/Project/GetAll').then(res => res.data),
      api.get('/TaskStatus/GetAll').then(res => res.data),
      api.get('/TaskType/GetAll').then(res => res.data),
      api.get('/Priority/GetAll').then(res => res.data),
      api.get('/User/GetAll').then(res => res.data),
    ]);

    return {
      projects: Array.isArray(projects) ? projects : (projects.data || []),
      statuses: Array.isArray(statuses) ? statuses : (statuses.data || []),
      taskTypes: Array.isArray(types) ? types : (types.data || []),
      priorities: Array.isArray(priorities) ? priorities : (priorities.data || []),
      users: Array.isArray(users) ? users : (users.data || []),
    };
  },

  // Fetch users assigned to a specific project.
  getProjectUsers: async (projectId: number): Promise<any[]> => {
    const response = await api.get(`/UserAssignedProject/GetUsersByProject/${projectId}`);
    const data = response.data as any;
    return data.data || data || [];
  }
};
