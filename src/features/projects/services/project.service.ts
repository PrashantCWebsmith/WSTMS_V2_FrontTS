import api from '@/api/axios-instance';
import { toast } from '@/utils/toast.utils';
import type { ApiResponse, ActionRequestDto, SQLReturnMessageNValue } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  ProjectCreateUpdateDto,
  ProjectDto
} from '../types/project.types';

// Service for managing project-related API interactions.
export const ProjectService = {
  // Fetch paginated projects for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<ProjectDto>> => {
    const response = await api.post<ApiResponse<PagedResult<ProjectDto>>>('/Project/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single project by ID for display or editing.
  getByID: async (id: number): Promise<ProjectDto> => {
    const response = await api.get<ApiResponse<ProjectDto>>(`/Project/Get/${id}`);
    return response.data.data!;
  },

  // Save or update a project entity.
  save: async (data: ProjectCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Project/Save', data);
    return response.data.data!;
  },

  // Delete a project by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return ProjectService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Project/Action`, params);
    return response.data.data!;
  }
};
