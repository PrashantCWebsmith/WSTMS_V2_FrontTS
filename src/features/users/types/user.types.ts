// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface UserModel {
  userIDP: number;
  userName: string;
  userFullName: string;
  emailID: string;
  mobileNo: string;
  address: string;
  employeeCode: string;
  joiningDate: string;
  roleIDF: number;
  roleName: string;
  reportingManagerIDF: number;
  reportingManagerName: string;
  status: boolean;
  password?: string;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface UserViewModel {
  userIDP: number;
  userName: string;
  userFullName: string;
  emailID: string;
  mobileNo: string;
  address: string;
  employeeCode: string;
  joiningDate: string;
  roleIDF: number;
  roleName: string;
  reportingManagerIDF: number;
  reportingManagerName: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface UserSaveModel {
  userIDP?: number;
  userName: string;
  password?: string;
  emailID: string;
  mobileNo: string;
  userFullName: string;
  address: string;
  roleIDF: number;
  employeeCode: string;
  joiningDate: string;
  reportingManagerIDF: number;
  status: boolean;
}


// FilterModel: Represents the filter parameters for lists.
export interface UserFilterModel {
  roleIDF?: number;
  status?: boolean;
  search?: string;
}

// Entity Model: Represents additional core data structures related to the entity.
export interface UserReportingHierarchyModel {
  userIDP: number;
  userName: string;
  userFullName?: string;
  reportingManagerIDF?: number;
}
