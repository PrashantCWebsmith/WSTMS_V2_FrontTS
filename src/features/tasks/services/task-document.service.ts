import api from '@/api/axios-instance';
import type { TaskDocumentModel } from '@/features/tasks/types/task.types';

// Service for managing task document API interactions.
export const TaskDocumentService = {
  // Fetch all documents for a specific task.
  getTaskWise: async (taskId: number): Promise<TaskDocumentModel[]> => {
    const response = await api.get(`/TaskDocument/GetTaskWise/${taskId}`);
    const data = response.data as any;
    return data.data || data || [];
  },

  // Upload a new task document using FormData.
  upload: async (data: FormData): Promise<any> => {
    const response = await api.post('/TaskDocument/Save', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete a task document by ID.
  delete: async (id: number): Promise<void> => {
    await api.get(`/TaskDocument/Delete?id=${id}`);
  }
};
