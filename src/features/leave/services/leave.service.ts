import api from '@/api/axios-instance';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  LeaveCreateUpdateDto,
  LeaveListDto,
  LeaveDto
} from '../types/leave.types';

// Service for managing leave-related API interactions.
export const LeaveService = {
  // Fetch paginated leaves for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<LeaveListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<LeaveListDto>>>('/Leave/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single leave by ID for display or editing.
  getByID: async (id: number): Promise<LeaveDto> => {
    const response = await api.get<ApiResponse<LeaveDto>>(`/Leave/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a leave entity.
  save: async (data: LeaveCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Leave/Save', data);
    return response.data.data!;
  },

  // Delete a leave by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return LeaveService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Leave/Action`, params);
    return response.data.data!;
  }
};
