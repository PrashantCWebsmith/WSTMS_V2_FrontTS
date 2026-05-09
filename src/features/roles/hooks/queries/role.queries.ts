import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { RoleService } from '../../services/role.service';
import type { RoleCreateUpdateDto } from '../../types/role.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing role data and state.

// Hook to fetch and manage paginated roles data.
export const useRoles = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => RoleService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single role's data.
export const useRole = (id: number) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => RoleService.getByID(id),
    enabled: !!id,
  });
};

// Hook to fetch role lookup data for dropdowns.
export const useRoleLookups = () => {
  return useQuery({
    queryKey: ['role-lookups'],
    queryFn: RoleService.getAll,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook to handle saving or updating a role entity.
export const useSaveRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleCreateUpdateDto) => RoleService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Hook to manage updating a role's status via generalAction.
export const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => RoleService.generalAction({ id, action: ActionStatusEnum.Status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Hook to handle role deletion via the role service.
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => RoleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
