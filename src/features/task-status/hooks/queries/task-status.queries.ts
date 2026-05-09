import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskStatusService } from '../../services/task-status.service';
import type { TaskStatusCreateUpdateDto } from '../../types/task-status.types';
import { TaskStatusActionStatusEnum } from '../../types/task-status.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing task status data and state.

// Hook to fetch and manage paginated task statuses data.
export const useTaskStatuses = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['task-statuses', params],
    queryFn: () => TaskStatusService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single task status's data.
export const useTaskStatus = (id: number) => {
  return useQuery({
    queryKey: ['task-statuses', id],
    queryFn: () => TaskStatusService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a task status entity.
export const useSaveTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskStatusCreateUpdateDto) => TaskStatusService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses'] });
    },
  });
};

// Hook to manage updating a task status's active state.
export const useUpdateTaskStatusActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskStatusService.generalAction({ id, action: TaskStatusActionStatusEnum.Status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses'] });
    },
  });
};

// Hook to handle task status deletion via the service.
export const useDeleteTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskStatusService.generalAction({ id, action: TaskStatusActionStatusEnum.Delete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses'] });
    },
  });
};

// Hook to manage updating kanban visibility.
export const useUpdateKanbanVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskStatusService.generalAction({ id, action: TaskStatusActionStatusEnum.Kanban }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses'] });
    },
  });
};
