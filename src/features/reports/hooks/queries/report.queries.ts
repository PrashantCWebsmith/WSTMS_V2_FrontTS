import { useQuery } from '@tanstack/react-query';
import { ReportService } from '../../services/report.service';
import type { TimeTrackingFilterModel } from '../../types/report.types';

// React Query hooks for fetching reports based on selected filters.

// Hook to fetch the time tracking report based on selected filters.
export const useTimeTrackingReport = (filters: TimeTrackingFilterModel, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['reports', 'time-tracking', filters],
    queryFn: () => ReportService.getTimeTracking(filters),
    enabled: enabled && !!filters.fromSystemDate && !!filters.toSystemDate,
  });
};
