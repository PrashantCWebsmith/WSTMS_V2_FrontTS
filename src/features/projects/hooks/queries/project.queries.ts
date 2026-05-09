import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { ProjectService } from '../../services/project.service';
import type { ProjectCreateUpdateDto } from '../../types/project.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing project data and state.

// Hook to fetch and manage paginated projects data.
export const useProjects = (params: CommonPagingRequestDto) => {
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
    mutationFn: (data: ProjectCreateUpdateDto) => ProjectService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to manage updating a project's status via generalAction.
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ProjectService.generalAction({ id, action: ActionStatusEnum.Status }),
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
