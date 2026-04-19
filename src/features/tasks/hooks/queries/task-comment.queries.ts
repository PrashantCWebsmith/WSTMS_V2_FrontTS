import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskCommentService } from '../../services/task-comment.service';

// React Query hooks for managing task comments.

// Hook to fetch and manage all comments for a specific task.
export const useTaskComments = (taskId: number) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => TaskCommentService.getTaskWise(taskId),
    enabled: !!taskId,
  });
};

// Hook to handle saving a new task comment.
export const useSaveTaskComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => TaskCommentService.save(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskIDF, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskIDF, 'detailed'] });
    },
  });
};

// Hook to handle the deletion of a task comment.
export const useDeleteTaskComment = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TaskCommentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'detailed'] });
    },
  });
};
