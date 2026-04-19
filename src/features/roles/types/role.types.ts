// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface RoleModel {
  roleIDP: number;
  roleName: string;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface RoleViewModel {
  roleIDP: number;
  roleName: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface RoleSaveModel {
  roleIDP?: number;
  roleName: string;
  status: boolean;
}
