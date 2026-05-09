import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionStatusEnum } from '@/types/api.types';

import { SMTPService } from '../../services/smtp.service';
import type { SMTPCreateUpdateDto } from '../../types/smtp.types';
import type { CommonPagingRequestDto } from '@/types/paging.types';

// React Query hooks for managing SMTP configuration data and state.

// Hook to fetch and manage paginated SMTP configurations data.
export const useSMTPs = (params: CommonPagingRequestDto) => {
  return useQuery({
    queryKey: ['smtps', params],
    queryFn: () => SMTPService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single SMTP configuration's data.
export const useSMTP = (id: number) => {
  return useQuery({
    queryKey: ['smtps', id],
    queryFn: () => SMTPService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating an SMTP configuration entity.
export const useSaveSMTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SMTPCreateUpdateDto) => SMTPService.save(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};

// Hook to manage updating an SMTP setting's status.
export const useUpdateSMTPStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SMTPService.generalAction({ id, action: ActionStatusEnum.Status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};

// Hook to handle SMTP setting deletion via the service.
export const useDeleteSMTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SMTPService.generalAction({ id, action: ActionStatusEnum.Delete }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};
