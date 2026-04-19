// interfaces for Model, ViewModel, and Persistence.

// ViewModel: Represents the data structure used for display in the UI.
export interface ProfileViewModel {
  userIDP: number;
  userName: string;
  userFullName: string;
  emailID: string;
  mobileNo: string;
  employeeCode: string;
  roleIDF: number;
  roleName?: string;
  joiningDate?: string;
  address?: string;
  linkedInProfile?: string;
  gitUserName?: string;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface ProfileSaveModel {
  userFullName: string;
  joiningDate: string | null;
  address: string;
  linkedInProfile: string;
  gitUserName: string;
}
