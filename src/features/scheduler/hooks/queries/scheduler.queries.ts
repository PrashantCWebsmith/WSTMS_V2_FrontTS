import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SchedulerService } from '../../services/scheduler.service';
import type { SchedulerSaveModel } from '../../types/scheduler.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing scheduler data and state.

// Hook to fetch paginated scheduler settings data.
export const useSchedulers = (params: PagingParamsModel) => {
  return useQuery({
    queryKey: ['schedulers', params],
    queryFn: () => SchedulerService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single scheduler setting's data.
export const useScheduler = (id: number) => {
  return useQuery({
    queryKey: ['schedulers', id],
    queryFn: () => SchedulerService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a scheduler setting entity.
export const useSaveScheduler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SchedulerSaveModel) => SchedulerService.save(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers'] }),
  });
};

// Hook to handle the deletion of a scheduler setting.
export const useDeleteScheduler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SchedulerService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers'] }),
  });
};
