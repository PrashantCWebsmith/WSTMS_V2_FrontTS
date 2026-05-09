import api from '@/api/axios-instance';
import type { LoginModel, AuthResponseModel } from '../types/auth.types';
import type { ApiResponse } from '@/types/api.types';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINTS
 * --------------------------------------------------------------------------
 */

/**
 * Executes login request and returns proper AuthResponse interface
 */
export async function login(credentials: LoginModel): Promise<AuthResponseModel> {
  const response = await api.post<ApiResponse<AuthResponseModel>>('/Auth/Login', credentials);
  return response.data.data!;
}

/**
 * Executes logout request
 */
export async function logout(): Promise<void> {
  await api.post('/Auth/Logout');
}
