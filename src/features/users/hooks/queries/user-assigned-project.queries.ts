import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserAssignedProjectService } from '../../services/user-assigned-project.service';
import type { UserAssignedProjectSaveModel } from '../../types/user-assigned-project.types';

// React Query hooks for managing user-project assignments.

// Hook to fetch all projects assigned to a specific user.
export const useUserAssignedProjects = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId, 'projects'],
    queryFn: () => UserAssignedProjectService.getAll(userId),
    enabled: !!userId,
  });
};

// Hook to handle saving or updating a user-project assignment.
export const useSaveUserAssignedProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserAssignedProjectSaveModel) => UserAssignedProjectService.save(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userIDF, 'projects'] });
    },
  });
};

// Hook to handle the deletion of a user-project assignment.
export const useDeleteUserAssignedProject = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UserAssignedProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'projects'] });
    },
  });
};
