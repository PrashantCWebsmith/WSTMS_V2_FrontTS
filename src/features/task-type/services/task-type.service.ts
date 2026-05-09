import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  TaskTypeCreateUpdateDto,
  TaskTypeListDto,
  TaskTypeDto
} from '../types/task-type.types';

// Service for managing task type API interactions.
export const TaskTypeService = {
  // Fetch paginated task types for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<TaskTypeListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<TaskTypeListDto>>>('/TaskType/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single task type by ID for display or editing.
  getByID: async (id: number): Promise<TaskTypeDto> => {
    const response = await api.get<ApiResponse<TaskTypeDto>>(`/TaskType/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a task type entity.
  save: async (data: TaskTypeCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/TaskType/Save', data);
    return response.data.data!;
  },

  // Delete a task type by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return TaskTypeService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/TaskType/Action`, params);
    return response.data.data!;
  }
};
