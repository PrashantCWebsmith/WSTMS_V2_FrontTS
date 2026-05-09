import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { SchedulerService } from '../../services/scheduler.service';
import type { SchedulerCreateUpdateDto } from '../../types/scheduler.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing scheduler data and state.

// Hook to fetch and manage paginated schedulers data.
export const useSchedulers = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['schedulers', params],
    queryFn: () => SchedulerService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single scheduler's data.
export const useScheduler = (id: number) => {
  return useQuery({
    queryKey: ['schedulers', id],
    queryFn: () => SchedulerService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a scheduler entity.
export const useSaveScheduler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SchedulerCreateUpdateDto) => SchedulerService.save(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers'] }),
  });
};

// Hook to handle the deletion of a scheduler setting.
export const useDeleteScheduler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SchedulerService.generalAction({ id, action: ActionStatusEnum.Delete }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers'] }),
  });
};
