import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveService } from '../../services/leave.service';
import type { LeaveSaveModel } from '../../types/leave.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing leave data and state.

// Hook to fetch and manage paginated leaves data.
export const useLeaves = (params: PagingParamsModel) => {
  return useQuery({
    queryKey: ['leaves', params],
    queryFn: () => LeaveService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single leave record's data.
export const useLeave = (id: number) => {
  return useQuery({
    queryKey: ['leaves', id],
    queryFn: () => LeaveService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating a leave entity.
export const useSaveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LeaveSaveModel) => LeaveService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

// Hook to handle the deletion of a leave record.
export const useDeleteLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => LeaveService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

// Hook to manage updating a leave's active state.
export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => LeaveService.generalAction(id, 'STATUS'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};
