import api from '@/api/axios-instance';
import type { ApiResponse } from '@/types/api.types';
import type { 
  TimeTrackingViewModel, 
  TimeTrackingFilterModel 
} from '../types/report.types';

// Service for managing report-related API interactions.
export const ReportService = {
  // Fetch the time tracking report based on selected filters.
  getTimeTracking: async (filters: TimeTrackingFilterModel): Promise<TimeTrackingViewModel[]> => {
    const response = await api.post<ApiResponse<TimeTrackingViewModel[]>>('/Task/TimeTracking', filters);
    return response.data.data || [];
  }
};
