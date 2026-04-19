import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectService } from '../../services/project.service';
import type { ProjectSaveModel } from '../../types/project.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing project data and state.

// Hook to fetch and manage paginated projects data.
export const useProjects = (params: PagingParamsModel) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => ProjectService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single project's data.
export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => ProjectService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a project entity.
export const useSaveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectSaveModel) => ProjectService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to manage updating a project's status via generalAction.
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ProjectService.generalAction(id, 'STATUS'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to handle project deletion via the project service.
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
