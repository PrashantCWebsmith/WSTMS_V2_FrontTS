import api from '@/api/axios-instance';
import type { PagedResult } from '@/types/paging.types';
import type { SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import type { 
  TaskListDto, 
  TaskCreateUpdateDto, 
  TaskLookupsModel, 
  TaskDetailedViewModel,
  TaskDto,
  TaskPagingFilterDto
} from '@/features/tasks/types/task.types';

// Service for managing task-related API interactions.
export const TaskService = {
  // Fetch paginated tasks for display with optional filters.
  getAllPaging: async (params: TaskPagingFilterDto): Promise<PagedResult<TaskListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<TaskListDto>>>(`/Task/GetPaging`, params);
    return response.data.data!;
  },

  // Fetch a single task by ID for display or editing.
  getByID: async (id: number): Promise<TaskDto> => {
    const response = await api.get<ApiResponse<TaskDto>>(`/Task/Get/${id}`);
    return response.data.data!;
  },

  // Fetch full task details including relations.
  getDetailed: async (id: number | string): Promise<TaskDetailedViewModel> => {
    const response = await api.get<ApiResponse<TaskDetailedViewModel>>(`/Task/GetTaskDetailed/${id}`);
    return response.data.data!;
  },

  // Save or update a task entity.
  save: async (data: TaskCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Task/Save', data);
    return response.data.data!;
  },

  // Delete a task by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return TaskService.generalAction(id, 'Delete');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string, remarks?: string): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Task/Action`, { id, action, remarks });
    return response.data.data!;
  },

  // Fetch tasks filtered by project.
  getProjectWise: async (projectId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/Task/GetProjectWiseTask/${projectId}`);
    return response.data.data || [];
  },

  // Fetch all related lookup data in a single call.
  getLookups: async (): Promise<TaskLookupsModel> => {
    const [projects, statuses, types, priorities, users] = await Promise.all([
      api.get<ApiResponse<any[]>>('/Project/GetAll').then(res => res.data.data || []),
      api.get<ApiResponse<any[]>>('/TaskStatus/GetAll').then(res => res.data.data || []),
      api.get<ApiResponse<any[]>>('/TaskType/GetAll').then(res => res.data.data || []),
      api.get<ApiResponse<any[]>>('/Priority/GetAll').then(res => res.data.data || []),
      api.get<ApiResponse<any[]>>('/User/GetAll').then(res => res.data.data || []),
    ]);

    return {
      projects,
      statuses,
      taskTypes: types,
      priorities,
      users,
    };
  },

  // Fetch users assigned to a specific project.
  getProjectUsers: async (projectId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/UserAssignedProject/GetUsersByProject/${projectId}`);
    return response.data.data || [];
  }
};
