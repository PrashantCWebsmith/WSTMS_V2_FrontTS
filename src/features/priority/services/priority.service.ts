import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  PriorityCreateUpdateDto,
  PriorityListDto,
  PriorityDto
} from '../types/priority.types';

// Service for managing task priority API interactions.
export const PriorityService = {
  // Fetch paginated priorities for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<PriorityListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<PriorityListDto>>>('/Priority/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single priority by ID for display or editing.
  getByID: async (id: number): Promise<PriorityDto> => {
    const response = await api.get<ApiResponse<PriorityDto>>(`/Priority/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a priority entity.
  save: async (data: PriorityCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Priority/Save', data);
    return response.data.data!;
  },

  // Delete a priority by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return PriorityService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Priority/Action`, params);
    return response.data.data!;
  }
};
