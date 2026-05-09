import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type { SQLReturnMessageNValue, ActionRequestDto, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';
import type {
  UserCreateUpdateDto,
  UserListDto,
  UserDto,
  UserFilterModel,
  UserReportingHierarchyModel
} from '../types/user.types';

// Service for managing user-related API interactions.
export const UserService = {
  // Fetch paginated users for display with optional filters.
  getAllPaging: async (params: CommonPagingRequestDto, filters?: UserFilterModel): Promise<PagedResult<UserListDto>> => {
    const payload = {
      ...params,
      roleIDF: filters?.roleIDF || 0,
      status: filters?.status === undefined ? null : filters.status
    };
    const response = await api.post<ApiResponse<PagedResult<UserListDto>>>('/User/GetPaging', payload);
    return response.data.data!;
  },

  // Fetch a single user by ID for display or editing.
  getByID: async (id: number): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>(`/User/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a user entity.
  save: async (data: UserCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/User/Save', data);
    return response.data.data!;
  },

  // Delete a user by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return UserService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/User/Action`, params);
    return response.data.data!;
  },

  // Fetch user reporting hierarchy for management views.
  getReportingHierarchy: async (): Promise<UserReportingHierarchyModel[]> => {
    const response = await api.get<ApiResponse<UserReportingHierarchyModel[]>>('/User/GetReportingHierarchy');
    return response.data.data || [];
  },

  // Fetch all users formatted for lookup purposes.
  getAll: async (): Promise<UserDto[]> => {
    const response = await api.get<ApiResponse<UserDto[]>>('/User/GetAll');
    return response.data.data || [];
  }
};
