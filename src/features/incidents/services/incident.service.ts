import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  IncidentModel,
  IncidentSaveModel,
  IncidentViewModel
} from '../types/incident.types';

// Service for managing incident-related API interactions.
export const IncidentService = {
  // Fetch paginated incidents for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<IncidentViewModel>> => {
    let url = `/Incident/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<IncidentViewModel>>(url);
    return response.data;
  },

  // Fetch a single incident by ID for display or editing.
  getByID: async (id: number): Promise<IncidentViewModel> => {
    const response = await api.get<IncidentViewModel>(`/Incident/Get/${id}`);
    return response.data;
  },

  // Save or update an incident entity.
  save: async (data: IncidentSaveModel): Promise<IncidentModel> => {
    const response = await api.post<IncidentModel>('/Incident/Save', data);
    return response.data;
  },

  // Delete an incident by ID.
  delete: async (id: number): Promise<void> => {
    return IncidentService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/Incident/Action`, { id, action });
  }
};
