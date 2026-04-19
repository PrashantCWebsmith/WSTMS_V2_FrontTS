// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface EmployeeDocumentModel {
  employeeDocumentIDP: number;
  userIDF: number;
  documentType: string;
  isLatest: boolean;
  remarks: string;
  originalFileName: string;
  documentPath: string;
  createdDateTime: string;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface EmployeeDocumentViewModel {
  employeeDocumentIDP: number;
  userIDF: number;
  documentType: string;
  isLatest: boolean;
  remarks: string;
  originalFileName: string;
  documentPath: string;
  createdDateTime: string;
}

// SaveModel: Represents the payload for creating or updating an entity (usually via FormData).
export interface EmployeeDocumentSaveModel {
  employeeDocumentIDP?: number;
  userIDF: number;
  documentType: string;
  isLatest: boolean;
  remarks: string;
}
