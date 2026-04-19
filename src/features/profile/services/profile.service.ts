import api from '@/api/axios-instance';
import type { 
  ProfileViewModel, 
  ProfileSaveModel 
} from '../types/profile.types';

// Service for managing user profile API interactions.
export const ProfileService = {
  // Fetch user profile data for display.
  get: async (id: number): Promise<ProfileViewModel> => {
    const response = await api.get<ProfileViewModel>(`/User/Get/${id}`);
    const data = response.data as any;
    return data.data || data;
  },

  // Update user profile information.
  update: async (data: ProfileSaveModel): Promise<void> => {
    await api.post('/User/UpdateProfile', data);
  }
};
