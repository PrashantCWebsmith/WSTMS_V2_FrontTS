import api from '@/api/axios-instance';
import type { ActionRequestDto, SQLReturnMessageNValue, ApiResponse } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type { PagedResult, CommonPagingRequestDto } from '@/types/paging.types';
import type {
  SMTPCreateUpdateDto,
  SMTPListDto,
  SMTPDto
} from '../types/smtp.types';

// Service for managing SMTP configuration API interactions.
export const SMTPService = {
  // Fetch paginated SMTP configurations for display.
  getAllPaging: async (params: CommonPagingRequestDto): Promise<PagedResult<SMTPListDto>> => {
    const response = await api.post<ApiResponse<PagedResult<SMTPListDto>>>('/SMTP/GetPaging', params);
    return response.data.data!;
  },

  // Fetch a single SMTP configuration by ID for display or editing.
  getByID: async (id: number): Promise<SMTPDto> => {
    const response = await api.get<ApiResponse<SMTPDto>>(`/SMTP/Get/${id}`);
    return response.data.data!;
  },

  // Save or update an SMTP configuration entity.
  save: async (data: SMTPCreateUpdateDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>('/SMTP/Save', data);
    return response.data.data!;
  },

  // Delete an SMTP configuration by ID.
  delete: async (id: number): Promise<SQLReturnMessageNValue> => {
    return SMTPService.generalAction({ id, action: ActionStatusEnum.Delete });
  },

  // Perform generalized actions like delete or status updates.
  generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {
    const response = await api.post<ApiResponse<SQLReturnMessageNValue>>(`/SMTP/Action`, params);
    return response.data.data!;
  }
};
