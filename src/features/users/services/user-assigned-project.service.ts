import api from '@/api/axios-instance';
import type {
  UserAssignedProjectViewModel,
  UserAssignedProjectSaveModel,
  UserAssignedProjectModel
} from '../types/user-assigned-project.types';

/**
 * --------------------------------------------------------------------------
 * USER ASSIGNED PROJECT SERVICE (CORE LOGIC ONLY)
 * --------------------------------------------------------------------------
 */

export const UserAssignedProjectService = {
  // Fetch all projects assigned to a specific user.
  getAll: async (userId: number): Promise<UserAssignedProjectViewModel[]> => {
    const response = await api.get(`/UserAssignedProject/GetAll/${userId}`);
    const data = response.data as any;
    return data.data || data || [];
  },

  // Save or update a user-project assignment.
  save: async (data: UserAssignedProjectSaveModel): Promise<UserAssignedProjectModel> => {
    const response = await api.post('/UserAssignedProject/Save', data);
    return response.data;
  },

  // Delete a user-project assignment by ID.
  delete: async (id: number): Promise<void> => {
    await api.put(`/UserAssignedProject/Action`, { id, action: 'DELETE' });
  }
};
