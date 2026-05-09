import api from '@/api/axios-instance';
import type { ApiResponse } from '@/types/api.types';
import type { 
  ProfileViewModel, 
  ProfileSaveModel 
} from '../types/profile.types';

// Service for managing user profile API interactions.
export const ProfileService = {
  // Fetch user profile data for display.
  get: async (id: number): Promise<ProfileViewModel> => {
    const response = await api.get<ApiResponse<ProfileViewModel>>(`/User/Get/${id}`);
    return response.data.data!;
  },

  // Update user profile information.
  update: async (data: ProfileSaveModel): Promise<void> => {
    await api.post('/User/UpdateProfile', data);
  }
};
