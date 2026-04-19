import api from '@/api/axios-instance';
import type { 
  TimeTrackingViewModel, 
  TimeTrackingFilterModel 
} from '../types/report.types';

// Service for managing report-related API interactions.
export const ReportService = {
  // Fetch the time tracking report based on selected filters.
  getTimeTracking: async (filters: TimeTrackingFilterModel): Promise<TimeTrackingViewModel[]> => {
    const response = await api.post('/Task/TimeTracking', filters);
    const data = response.data as any;
    return data.data || data || [];
  }
};
