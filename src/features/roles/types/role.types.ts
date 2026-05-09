export interface RoleCreateUpdateDto {
  roleIDP?: number;
  roleName: string;
  status: boolean;
}

export interface RoleListDto {
  roleIDP: number;
  roleName: string;
  status: boolean;
}

export interface RoleDto {
  roleIDP: number;
  roleName: string;
  status?: boolean | null;
  createdDateTime?: string | null;
}
