import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  TaskTypeModel,
  TaskTypeSaveModel,
  TaskTypeViewModel
} from '../types/task-type.types';

// Service for managing task type API interactions.
export const TaskTypeService = {
  // Fetch paginated task types for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<TaskTypeViewModel>> => {
    let url = `/TaskType/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<TaskTypeViewModel>>(url);
    return response.data;
  },

  // Fetch a single task type by ID for display or editing.
  getByID: async (id: number): Promise<TaskTypeViewModel> => {
    const response = await api.get<TaskTypeViewModel>(`/TaskType/Get/${id}`);
    return response.data;
  },

  // Save or update a task type entity.
  save: async (data: TaskTypeSaveModel): Promise<TaskTypeModel> => {
    const response = await api.post<TaskTypeModel>('/TaskType/Save', data);
    return response.data;
  },

  // Delete a task type by ID.
  delete: async (id: number): Promise<void> => {
    return TaskTypeService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/TaskType/Action`, { id, action });
  }
};
