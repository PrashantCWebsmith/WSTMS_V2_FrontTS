// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface TaskTypeModel {
  taskTypeIDP: number;
  taskType: string;
  description: string;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface TaskTypeViewModel {
  taskTypeIDP: number;
  taskType: string;
  description: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface TaskTypeSaveModel {
  taskTypeIDP?: number;
  taskType: string;
  description: string;
  status: boolean;
}
