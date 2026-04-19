import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SMTPService } from '../../services/smtp.service';
import type { SMTPSaveModel } from '../../types/smtp.types';
import type { PagingParamsModel } from '@/types/paging.types';

// React Query hooks for managing SMTP configuration data and state.

// Hook to fetch paginated SMTP settings data.
export const useSMTPs = (params: PagingParamsModel) => {
  return useQuery({
    queryKey: ['smtps', params],
    queryFn: () => SMTPService.getAllPaging(params),
  });
};

// Hook to fetch and manage a single SMTP setting's data.
export const useSMTP = (id: number) => {
  return useQuery({
    queryKey: ['smtps', id],
    queryFn: () => SMTPService.getByID(id),
    enabled: !!id,
  });
};

// Hook to handle saving or updating an SMTP setting entity.
export const useSaveSMTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SMTPSaveModel) => SMTPService.save(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};

// Hook to manage updating an SMTP setting's status.
export const useUpdateSMTPStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SMTPService.generalAction(id, 'STATUS'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};

// Hook to handle SMTP setting deletion via the service.
export const useDeleteSMTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => SMTPService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smtps'] }),
  });
};
