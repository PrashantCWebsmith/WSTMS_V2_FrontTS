import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { PriorityService } from '../../services/priority.service';
import type { PriorityCreateUpdateDto } from '../../types/priority.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing task priority data and state.

// Hook to fetch and manage paginated priorities data.
export const usePriorities = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['priorities', params],
    queryFn: () => PriorityService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single priority's data.
export const usePriority = (id: number) => {
  return useQuery({
    queryKey: ['priorities', id],
    queryFn: () => PriorityService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a priority entity.
export const useSavePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PriorityCreateUpdateDto) => PriorityService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
};

// Hook to manage updating a priority's status.
export const useUpdatePriorityStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PriorityService.generalAction({ id, action: ActionStatusEnum.Status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
};

// Hook to handle priority deletion via the service.
export const useDeletePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PriorityService.generalAction({ id, action: ActionStatusEnum.Delete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
};
