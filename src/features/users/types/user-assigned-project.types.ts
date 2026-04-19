// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface UserAssignedProjectModel {
  assignProjectIDP: number;
  userIDF: number;
  projectIDF: number;
  projectName?: string;
  userName?: string;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface UserAssignedProjectViewModel {
  assignProjectIDP: number;
  userIDF: number;
  projectIDF: number;
  projectName?: string;
  userName?: string;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface UserAssignedProjectSaveModel {
  assignProjectIDP?: number;
  userIDF: number;
  projectIDF: number;
}
