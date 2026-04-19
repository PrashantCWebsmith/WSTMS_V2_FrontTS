// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface ProjectModel {
  projectIDP: number;
  projectName: string;
  ownerDetails?: string;
  websiteCredential?: string;
  contactPerson?: string;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface ProjectViewModel {
  projectIDP: number;
  projectName: string;
  projectCode?: string;
  ownerDetails?: string;
  websiteCredential?: string;
  contactPerson?: string;
  clientName?: string;
  headName?: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface ProjectSaveModel {
  projectIDP?: number;
  projectName: string;
  ownerDetails?: string;
  websiteCredential?: string;
  contactPerson?: string;
  status: boolean;
}

