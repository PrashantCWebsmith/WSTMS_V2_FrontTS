import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  ProjectModel,
  ProjectSaveModel,
  ProjectViewModel
} from '../types/project.types';

// Service for managing project-related API interactions.
export const ProjectService = {
  // Fetch paginated projects for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<ProjectViewModel>> => {
    let url = `/Project/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<ProjectViewModel>>(url);
    return response.data;
  },

  // Fetch a single project by ID for display or editing.
  getByID: async (id: number): Promise<ProjectViewModel> => {
    const response = await api.get<ProjectViewModel>(`/Project/Get/${id}`);
    return response.data;
  },

  // Save or update a project entity.
  save: async (data: ProjectSaveModel): Promise<ProjectModel> => {
    const response = await api.post<ProjectModel>('/Project/Save', data);
    return response.data;
  },

  // Delete a project by ID.
  delete: async (id: number): Promise<void> => {
    return ProjectService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/Project/Action`, { id, action });
  }
};
