import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type {
  RoleModel,
  RoleSaveModel,
  RoleViewModel
} from '../types/role.types';

// Service for managing user role API interactions.
export const RoleService = {
  // Fetch paginated roles for display.
  getAllPaging: async (params: PagingParamsModel): Promise<PagedResultModel<RoleViewModel>> => {
    let url = `/Role/GetPaging?page=${params.page}&size=${params.size}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    const response = await api.get<PagedResultModel<RoleViewModel>>(url);
    return response.data;
  },

  // Fetch a single role by ID for display or editing.
  getByID: async (id: number): Promise<RoleViewModel> => {
    const response = await api.get<RoleViewModel>(`/Role/Get/${id}`);
    return response.data;
  },

  // Save or update a role entity.
  save: async (data: RoleSaveModel): Promise<RoleModel> => {
    const response = await api.post<RoleModel>('/Role/Save', data);
    return response.data;
  },

  // Delete a role by ID.
  delete: async (id: number): Promise<void> => {
    return RoleService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/Role/Action`, { id, action });
  },

  // Fetch all roles for dropdown selections.
  getAll: async (): Promise<RoleViewModel[]> => {
    const response = await api.get('/Role/GetAll');
    const data = response.data as any;
    return data.data || data || [];
  }
};
