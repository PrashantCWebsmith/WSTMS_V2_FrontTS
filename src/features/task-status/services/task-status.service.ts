import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  TaskStatusModel,
  TaskStatusSaveModel,
  TaskStatusViewModel
} from '../types/task-status.types';

// Service for managing task status API interactions.
export const TaskStatusService = {
  // Fetch paginated task statuses for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<TaskStatusViewModel>> => {
    const response = await api.get<PagedResultModel<TaskStatusViewModel>>(`/TaskStatus/GetPaging?page=${params.page}&size=${params.size}&search=${params.search || ''}`);
    return response.data;
  },

  // Fetch a single task status by ID for display or editing.
  getByID: async (id: number): Promise<TaskStatusViewModel> => {
    const response = await api.get<TaskStatusViewModel>(`/TaskStatus/Get/${id}`);
    return response.data;
  },

  // Save or update a task status entity.
  save: async (data: TaskStatusSaveModel): Promise<TaskStatusModel> => {
    const response = await api.post<TaskStatusModel>('/TaskStatus/Save', data);
    return response.data;
  },

  // Delete a task status by ID.
  delete: async (id: number): Promise<void> => {
    return TaskStatusService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/TaskStatus/Action`, { id, action });
  }
};
