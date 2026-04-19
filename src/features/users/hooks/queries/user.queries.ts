import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../services/user.service';
import type { UserSaveModel, UserFilterModel } from '../../types/user.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing user data and state.

// Hook to fetch paginated users data with optional filters.
export const useUsers = (params: PagingParamsModel, filters?: UserFilterModel) => {
  return useQuery({
    queryKey: ['users', params, filters],
    queryFn: () => UserService.getAllPaging(params, filters),
  });
};

// Hook to fetch and manage a single user's data.
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => UserService.getByID(id),
    enabled: !!id,
  });
};

// Hook to fetch user lookup data for dropdowns.
export const useUserLookups = () => {
  return useQuery({
    queryKey: ['user-lookups'],
    queryFn: UserService.getAllLookup,
  });
};

// Hook to fetch the reporting hierarchy structure.
export const useUserReportingHierarchy = () => {
  return useQuery({
    queryKey: ['user-hierarchy'],
    queryFn: UserService.getReportingHierarchy,
  });
};

// Hook to handle saving or updating a user entity.
export const useSaveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserSaveModel) => UserService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-lookups'] });
    },
  });
};

// Hook to manage updating a user's status via generalAction.
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UserService.generalAction(id, 'STATUS'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook to handle user deletion via the user service.
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-lookups'] });
    },
  });
};
