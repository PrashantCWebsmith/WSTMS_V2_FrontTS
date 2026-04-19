// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface TaskStatusModel {
  taskStatusIDP: number;
  taskStatus: string;
  description: string;
  sortOrder: number;
  status: boolean;
  isDisplayInKanban: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface TaskStatusViewModel {
  taskStatusIDP: number;
  taskStatus: string;
  description: string;
  sortOrder: number;
  status: boolean;
  isDisplayInKanban: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface TaskStatusSaveModel {
  taskStatusIDP?: number;
  taskStatus: string;
  description: string;
  sortOrder: number;
  status: boolean;
  isDisplayInKanban: boolean;
}

