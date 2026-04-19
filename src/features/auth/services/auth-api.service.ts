import api from '@/api/axios-instance';
import type { LoginCredentials, AuthResponse } from '../types/auth.types';

/**
 * --------------------------------------------------------------------------
 * API ENDPOINTS
 * --------------------------------------------------------------------------
 */

/**
 * Executes login request and returns proper AuthResponse interface
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/Auth/Login', credentials);
  return data;
}

/**
 * Executes logout request
 */
export async function logout(): Promise<void> {
  await api.post('/Auth/Logout');
}
