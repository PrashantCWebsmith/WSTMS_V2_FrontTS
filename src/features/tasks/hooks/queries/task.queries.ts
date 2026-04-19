import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '../../services/task.service';
import type { TaskFilterModel, TaskSaveModel } from '../../types/task.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing core task data and relationships.

// Hook to fetch paginated tasks data with optional filters.
export const useTasks = (params: PagingParamsModel, filters?: TaskFilterModel) => {
  return useQuery({
    queryKey: ['tasks', params, filters],
    queryFn: () => TaskService.getAllPaging(params, filters),
  });
};

// Hook to fetch and manage a single task's data.
export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => TaskService.getByID(id),
    enabled: !!id,
  });
};

// Hook to fetch and manage full task details including relations.
export const useTaskDetailed = (id: number | string) => {
  return useQuery({
    queryKey: ['tasks', id, 'detailed'],
    queryFn: () => TaskService.getDetailed(id),
    enabled: !!id,
  });
};

// Hook to fetch all task-related lookup data.
export const useTaskLookups = () => {
  return useQuery({
    queryKey: ['task-lookups'],
    queryFn: TaskService.getLookups,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch users assigned to a specific project.
export const useProjectUsers = (projectId: number) => {
  return useQuery({
    queryKey: ['project-users', projectId],
    queryFn: () => TaskService.getProjectUsers(projectId),
    enabled: !!projectId,
  });
};

// Hook to handle saving or updating a task entity.
export const useSaveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskSaveModel) => TaskService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Hook to handle task deletion via the task service.
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
