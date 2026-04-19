import api from '@/api/axios-instance';
import type { TaskCommentModel } from '@/features/tasks/types/task.types';

// Service for managing task comment API interactions.
export const TaskCommentService = {
  // Fetch all comments for a specific task.
  getTaskWise: async (taskId: number): Promise<TaskCommentModel[]> => {
    const response = await api.get(`/TaskComment/GetTaskWise/${taskId}`);
    const data = response.data as any;
    return data.data || data || [];
  },

  // Save a new task comment.
  save: async (data: any): Promise<any> => {
    const response = await api.post('/TaskComment/Save', data);
    return response.data;
  },

  // Delete a task comment by ID.
  delete: async (id: number): Promise<void> => {
    await api.get(`/TaskComment/Delete?id=${id}`);
  }
};
