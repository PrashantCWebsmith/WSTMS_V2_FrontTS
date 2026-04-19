// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface IncidentModel {
  incidentIDP: number;
  projectIDF: number;
  taskIDF?: number;
  userIDF: number;
  criticalPoint: string;
  nonCriticalPoint: string;
  severity: string;
  incidentDate: string;
  status: string;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface IncidentViewModel {
  incidentIDP: number;
  projectIDF: number;
  taskIDF?: number;
  userIDF: number;
  criticalPoint: string;
  nonCriticalPoint: string;
  severity: string;
  incidentDate: string;
  status: string;
  projectName?: string;
  userName?: string;
  userFullName?: string;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface IncidentSaveModel {
  incidentIDP?: number;
  projectIDF: number;
  taskIDF?: number;
  userIDF: number;
  criticalPoint: string;
  nonCriticalPoint: string;
  severity: string;
  incidentDate: string | Date;
  status: string;
}

// PagingModel: Represents the paginated response containing a collection of ViewModels.
export interface IncidentPagingModel {
  data: IncidentViewModel[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
