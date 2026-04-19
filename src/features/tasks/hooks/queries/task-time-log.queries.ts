import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskTimeLogService } from '../../services/task-time-log.service';

// React Query hooks for managing task time logs.

// Hook to fetch and manage all time logs for a specific task.
export const useTaskTimeLogs = (taskId: number) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'timeLogs'],
    queryFn: () => TaskTimeLogService.getTaskWise(taskId),
    enabled: !!taskId,
  });
};

// Hook to handle saving or updating a task time log.
export const useSaveTaskTimeLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => TaskTimeLogService.save(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskIDF, 'timeLogs'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskIDF, 'detailed'] });
    },
  });
};
