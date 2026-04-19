// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface LeaveModel {
  leaveIDP: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description: string;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface LeaveViewModel {
  leaveIDP: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface LeaveSaveModel {
  leaveIDP?: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description: string;
  status: boolean;
}

// PagingModel: Represents the paginated response containing a collection of ViewModels.
export interface LeavePagingModel {
  data: LeaveViewModel[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
