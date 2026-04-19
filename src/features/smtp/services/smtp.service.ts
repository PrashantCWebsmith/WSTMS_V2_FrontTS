import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  SMTPModel,
  SMTPSaveModel,
  SMTPViewModel
} from '../types/smtp.types';

// Service for managing SMTP configuration API interactions.
export const SMTPService = {
  // Fetch paginated SMTP settings for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<SMTPViewModel>> => {
    let url = `/SMTP/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<SMTPViewModel>>(url);
    return response.data;
  },

  // Fetch a single SMTP setting by ID for display or editing.
  getByID: async (id: number): Promise<SMTPViewModel> => {
    const response = await api.get<SMTPViewModel>(`/SMTP/Get/${id}`);
    return response.data;
  },

  // Save or update an SMTP setting entity.
  save: async (data: SMTPSaveModel): Promise<SMTPModel> => {
    const response = await api.post<SMTPModel>('/SMTP/Save', data);
    return response.data;
  },

  // Delete an SMTP setting by ID.
  delete: async (id: number): Promise<void> => {
    return SMTPService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/SMTP/Action/${id}?action=${action}`);
  }
};
