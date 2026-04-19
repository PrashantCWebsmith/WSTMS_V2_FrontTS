import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '../../services/profile.service';
import type { ProfileSaveModel } from '../../types/profile.types';

// React Query hooks for managing user profile data and updates.

// Hook to fetch and manage user profile data for display.
export const useProfile = (id: number | undefined) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => ProfileService.get(id!),
    enabled: !!id,
  });
};

// Hook to handle updating user profile information.
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileSaveModel) => ProfileService.update(data),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
