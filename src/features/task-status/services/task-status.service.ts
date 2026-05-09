import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type { SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import {
  type TaskStatusCreateUpdateDto,
  type TaskStatusListDto,
  type TaskStatusDto,
  type TaskStatusActionRequestDto,
  TaskStatusActionStatusEnum
} from '../types/task-status.types';

// Service for managing task status API interactions.
export const TaskStatusService = {
  // Fetch paginated task statuses for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<TaskStatusListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<TaskStatusListDto>>>('/TaskStatus/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single task status by ID for display or editing.
  getByID: async (id: number): Promise<TaskStatusDto> => {
    const response = await api.get<ApiResponse<TaskStatusDto>>(`/TaskStatus/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a task status entity.
  save: async (data: TaskStatusCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/TaskStatus/Save', data);
    return response.data.data!;
  },

  // Delete a task status by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return TaskStatusService.generalAction({ id, action: TaskStatusActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: TaskStatusActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/TaskStatus/Action`, params);
    return response.data.data!;
  }
};
