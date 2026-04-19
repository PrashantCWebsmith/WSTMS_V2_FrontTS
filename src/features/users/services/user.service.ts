import api from '@/api/axios-instance';
import type { PagedResultModel, PagingParamsModel } from '@/types/paging.types';
import type { 
  UserModel, 
  UserSaveModel, 
  UserViewModel,
  UserFilterModel,
  UserReportingHierarchyModel
} from '../types/user.types';

// Service for managing user-related API interactions.
export const UserService = {
  // Fetch paginated users for display with optional filters.
  getAllPaging: async (params: PagingParamsModel, filters?: UserFilterModel): Promise<PagedResultModel<UserViewModel>> => {
    let url = `/User/GetPaging?page=${params.page}&size=${params.size}`;
    const search = params.search || filters?.search;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (filters?.roleIDF && filters.roleIDF > 0) {
      url += `&roleIDF=${filters.roleIDF}`;
    }
    const response = await api.get<PagedResultModel<UserViewModel>>(url);
    return response.data;
  },

  // Fetch a single user by ID for display or editing.
  getByID: async (id: number): Promise<UserViewModel> => {
    const response = await api.get<UserViewModel>(`/User/Get/${id}`);
    return response.data;
  },

  // Save or update a user entity.
  save: async (data: UserSaveModel): Promise<UserModel> => {
    const response = await api.post<UserModel>('/User/Save', data);
    return response.data;
  },

  // Delete a user by ID.
  delete: async (id: number): Promise<void> => {
    return UserService.generalAction(id, 'DELETE');
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (id: number, action: string): Promise<void> => {
    await api.put(`/User/Action`, { id, action });
  },

  // Fetch all users formatted for lookup purposes.
  getAllLookup: async (): Promise<UserViewModel[]> => {
    const response = await api.get<UserViewModel[]>('/User/GetAll');
    const data = response.data as any;
    return data.data || data || [];
  },

  // Fetch user reporting hierarchy for management views.
  getReportingHierarchy: async (): Promise<UserReportingHierarchyModel[]> => {
    const response = await api.get<UserReportingHierarchyModel[]>('/User/GetReportingHierarchy');
    const data = response.data as any;
    return data.data || data || [];
  }
};
