import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { TaskTypeService } from '../../services/task-type.service';
import type { TaskTypeCreateUpdateDto } from '../../types/task-type.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing task type data and state.

// Hook to fetch and manage paginated task types data.
export const useTaskTypes = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['task-types', params],
    queryFn: () => TaskTypeService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single task type's data.
export const useTaskType = (id: number) => {
  return useQuery({
    queryKey: ['task-types', id],
    queryFn: () => TaskTypeService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a task type entity.
export const useSaveTaskType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskTypeCreateUpdateDto) => TaskTypeService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-types'] });
    },
  });
};

// Hook to manage updating a task type's active state.
export const useUpdateTaskTypeActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskTypeService.generalAction({ id, action: ActionStatusEnum.Status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-types'] });
    },
  });
};

// Hook to handle task type deletion via the service.
export const useDeleteTaskType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskTypeService.generalAction({ id, action: ActionStatusEnum.Delete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-types'] });
    },
  });
};
