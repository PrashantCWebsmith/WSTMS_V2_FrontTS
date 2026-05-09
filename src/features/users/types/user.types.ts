export interface UserCreateUpdateDto {
  userIDP?: number;
  userName: string;
  password?: string;
  emailID?: string | null;
  mobileNo?: string | null;
  roleIDF: number;
  employeeCode?: string | null;
  joiningDate?: string | null;
  reportingManagerIDF?: number | null;
  status: boolean;
  userFullName?: string | null;
  address?: string | null;
}

export interface UserListDto {
  userIDP: number;
  userName: string;
  userFullName?: string | null;
  emailID?: string | null;
  mobileNo?: string | null;
  roleName?: string | null;
  reportingManagerName?: string | null;
  status: boolean;
}

export interface UserDto {
  userIDP: number;
  userName: string;
  userFullName?: string | null;
  emailID?: string | null;
  mobileNo?: string | null;
  address?: string | null;
  employeeCode?: string | null;
  joiningDate?: string | null;
  roleIDF: number;
  roleName?: string | null;
  reportingManagerIDF?: number | null;
  reportingManagerName?: string | null;
  status: boolean;
}

export interface UserFilterModel {
  roleIDF?: number;
  status?: boolean;
}

export interface UserReportingHierarchyModel {
  id: number;
  label: string;
  children?: UserReportingHierarchyModel[];
}
