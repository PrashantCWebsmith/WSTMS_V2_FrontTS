// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface PriorityModel {
  priorityIDP: number;
  priorityName: string;
  priorityColor: string;
  description: string;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface PriorityViewModel {
  priorityIDP: number;
  priorityName: string;
  priorityColor: string;
  description: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface PrioritySaveModel {
  priorityIDP?: number;
  priorityName: string;
  priorityColor: string;
  description: string;
  status: boolean;
}