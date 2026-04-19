import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeDocumentService } from '../../services/employee-document.service';

// React Query hooks for managing employee document data.

// Hook to fetch and manage documents associated with a specific user.
export const useEmployeeDocuments = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId, 'documents'],
    queryFn: () => EmployeeDocumentService.getByUser(userId),
    enabled: !!userId,
  });
};

// Hook to handle uploading a new employee document.
export const useUploadEmployeeDocument = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => EmployeeDocumentService.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'documents'] });
    },
  });
};

// Hook to handle the deletion of an employee document.
export const useDeleteEmployeeDocument = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => EmployeeDocumentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'documents'] });
    },
  });
};
