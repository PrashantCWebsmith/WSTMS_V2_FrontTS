import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  PriorityModel,
  PrioritySaveModel,
  PriorityViewModel
} from '../types/priority.types';

// Service for managing task priority API interactions.
export const PriorityService = {
  // Fetch paginated priorities for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<PriorityViewModel>> => {
    let url = `/Priority/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<PriorityViewModel>>(url);
    return response.data;
  },

  // Fetch a single priority by ID for display or editing.
  getByID: async (id: number): Promise<PriorityViewModel> => {
    const response = await api.get<PriorityViewModel>(`/Priority/Get/${id}`);
    return response.data;
  },

  // Save or update a priority entity.
  save: async (data: PrioritySaveModel): Promise<PriorityModel> => {
    const response = await api.post<PriorityModel>('/Priority/Save', data);
    return response.data;
  },

  // Delete a priority by ID.
  delete: async (id: number): Promise<void> => {
    return PriorityService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/Priority/Action`, { id, action });
  }
};
