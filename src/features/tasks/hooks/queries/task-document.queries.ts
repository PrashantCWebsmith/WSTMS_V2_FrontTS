import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskDocumentService } from '../../services/task-document.service';

// React Query hooks for managing task documents.

// Hook to fetch and manage all documents for a specific task.
export const useTaskDocuments = (taskId: number) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'documents'],
    queryFn: () => TaskDocumentService.getTaskWise(taskId),
    enabled: !!taskId,
  });
};

// Hook to handle uploading a new task document.
export const useSaveTaskDocument = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => TaskDocumentService.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'documents'] });
    },
  });
};

// Hook to handle the deletion of a task document.
export const useDeleteTaskDocument = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskDocumentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'documents'] });
    },
  });
};
