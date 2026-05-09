import api from '@/api/axios-instance';
import type { ActionRequestDto } from '@/types/api.types';
import { ActionStatusEnum } from '@/types/api.types';

import type {
  EmployeeDocumentViewModel
} from '../types/employee-document.types';

/**
 * --------------------------------------------------------------------------
 * EMPLOYEE DOCUMENT SERVICE (CORE LOGIC ONLY)
 * --------------------------------------------------------------------------
 */

export const EmployeeDocumentService = {
  // Fetch all documents associated with a specific user.
  getByUser: async (userId: number): Promise<EmployeeDocumentViewModel[]> => {
    const response = await api.get(`/EmployeeDocument/GetByUser?userId=${userId}`);
    let data = response.data?.data || response.data || [];
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = []; }
    }
    return Array.isArray(data) ? data : [];
  },

  // Upload a new employee document using FormData.
  upload: async (data: FormData): Promise<any> => {
    const response = await api.post('/EmployeeDocument/UploadDocument', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete an employee document by ID.
  delete: async (id: number): Promise<void> => {
    await api.put(`/EmployeeDocument/Action`, { id, action: 'DELETE' });
  },

  // Download an employee document as a Blob.
  download: async (id: number): Promise<Blob> => {
    const response = await api.get(`/EmployeeDocument/Download/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
