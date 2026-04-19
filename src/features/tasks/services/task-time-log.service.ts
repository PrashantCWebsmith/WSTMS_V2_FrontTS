import api from '@/api/axios-instance';
import type { TaskTimeLogModel } from '@/features/tasks/types/task.types';

// Service for managing task time log API interactions.
export const TaskTimeLogService = {
  // Fetch all time logs for a specific task.
  getTaskWise: async (taskId: number): Promise<TaskTimeLogModel[]> => {
    const response = await api.get(`/TaskTimeLog/GetTaskWise/${taskId}`);
    const data = response.data as any;
    return data.data || data || [];
  },

  // Save or update a task time log.
  save: async (data: any): Promise<any> => {
    const response = await api.post('/TaskTimeLog/Save', data);
    return response.data;
  },

  // Stop all active timers for the current user.
  stopAll: async (): Promise<void> => {
    await api.post('/TaskTimeLog/StopAll');
  }
};
