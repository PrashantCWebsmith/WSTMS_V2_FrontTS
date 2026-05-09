import api from '@/api/axios-instance';
import type { ActionRequestDto, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type { SQLReturnMessageNValue } from '@/types/api.types';
import type {
  SchedulerCreateUpdateDto,
  SchedulerListDto,
  SchedulerDto
} from '../types/scheduler.types';

// Service for managing scheduler-related API interactions.
export const SchedulerService = {
  // Fetch paginated schedulers for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<SchedulerListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<SchedulerListDto>>>('/Scheduler/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single scheduler by ID for display or editing.
  getByID: async (id: number): Promise<SchedulerDto> => {
    const response = await api.get<ApiResponse<SchedulerDto>>(`/Scheduler/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a scheduler entity.
  save: async (data: SchedulerCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Scheduler/Save', data);
    return response.data.data!;
  },

  // Delete a scheduler by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return SchedulerService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Scheduler/Action`, params);
    return response.data.data!;
  }
};
