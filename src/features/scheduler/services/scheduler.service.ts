import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  SchedulerModel,
  SchedulerSaveModel,
  SchedulerViewModel
} from '../types/scheduler.types';

// Service for managing scheduler-related API interactions.
export const SchedulerService = {
  // Fetch paginated scheduler settings for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<SchedulerViewModel>> => {
    let url = `/Scheduler/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<SchedulerViewModel>>(url);
    return response.data;
  },

  // Fetch a single scheduler setting by ID for display or editing.
  getByID: async (id: number): Promise<SchedulerViewModel> => {
    const response = await api.get<SchedulerViewModel>(`/Scheduler/Get/${id}`);
    return response.data;
  },

  // Save or update a scheduler setting entity.
  save: async (data: SchedulerSaveModel): Promise<SchedulerModel> => {
    const response = await api.post<SchedulerModel>('/Scheduler/Save', data);
    return response.data;
  },

  // Delete a scheduler setting by ID.
  delete: async (id: number): Promise<void> => {
    await api.get(`/Scheduler/Delete?id=${id}`);
  }
};
