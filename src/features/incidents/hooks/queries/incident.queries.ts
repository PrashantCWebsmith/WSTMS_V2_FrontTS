import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IncidentService } from '../../services/incident.service';
import type { IncidentSaveModel } from '../../types/incident.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing incident data and state.

// Hook to fetch and manage paginated incidents data.
export const useIncidents = (params: PagingParamsModel) => {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => IncidentService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single incident's data.
export const useIncident = (id: number) => {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => IncidentService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating an incident entity.
export const useSaveIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IncidentSaveModel) => IncidentService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// Hook to handle incident deletion via the service.
export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => IncidentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
