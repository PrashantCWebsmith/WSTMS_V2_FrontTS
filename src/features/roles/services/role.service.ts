import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  RoleCreateUpdateDto,
  RoleListDto,
  RoleDto
} from '../types/role.types';

// Service for managing role-related API interactions.
export const RoleService = {
  // Fetch paginated roles for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<RoleListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<RoleListDto>>>('/Role/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single role by ID for display or editing.
  getByID: async (id: number): Promise<RoleDto> => {
    const response = await api.get<ApiResponse<RoleDto>>(`/Role/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a role entity.
  save: async (data: RoleCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Role/Save', data);
    return response.data.data!;
  },

  // Delete a role by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return RoleService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Role/Action`, params);
    return response.data.data!;
  },

  // Fetch all roles for dropdown selections.
  getAll: async (): Promise<RoleDto[]> => {
    const response = await api.get<ApiResponse<RoleDto[]>>('/Role/GetAll');
    return response.data.data || [];
  }
};
