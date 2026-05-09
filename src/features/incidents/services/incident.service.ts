import api from '@/api/axios-instance';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  IncidentCreateUpdateDto,
  IncidentListDto,
  IncidentDto
} from '../types/incident.types';

// Service for managing incident-related API interactions.
export const IncidentService = {
  // Fetch paginated incidents for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<IncidentListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<IncidentListDto>>>('/Incident/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single incident by ID for display or editing.
  getByID: async (id: number): Promise<IncidentDto> => {
    const response = await api.get<ApiResponse<IncidentDto>>(`/Incident/Get/${id}`);
    return response.data.data!;
  },

  // Save or update an incident entity.
  save: async (data: IncidentCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/Incident/Save', data);
    return response.data.data!;
  },

  // Delete an incident by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return IncidentService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/Incident/Action`, params);
    return response.data.data!;
  }
};
