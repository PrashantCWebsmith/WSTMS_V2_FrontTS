import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  LeaveModel,
  LeaveSaveModel,
  LeaveViewModel
} from '../types/leave.types';

// Service for managing leave-related API interactions.
export const LeaveService = {
  // Fetch paginated leave records for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<LeaveViewModel>> => {
    let url = `/Leave/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<LeaveViewModel>>(url);
    return response.data;
  },

  // Fetch a single leave record by ID for display or editing.
  getByID: async (id: number): Promise<LeaveViewModel> => {
    const response = await api.get<LeaveViewModel>(`/Leave/Get/${id}`);
    return response.data;
  },

  // Save or update a leave entity.
  save: async (data: LeaveSaveModel): Promise<LeaveModel> => {
    const response = await api.post<LeaveModel>('/Leave/Save', data);
    return response.data;
  },

  // Delete a leave record by ID.
  delete: async (id: number): Promise<void> => {
    return LeaveService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/Leave/Action`, { id, action });
  }
};
