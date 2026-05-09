export interface ProjectDto {
  projectIDP: number;
  projectName: string;
  projectCode?: string | null;
  ownerDetails?: string | null;
  websiteCredential?: string | null;
  contactPerson?: string | null;
  status?: boolean | null;
  createdDateTime?: string | null;
}

export interface ProjectCreateUpdateDto {
  projectIDP?: number;
  projectName: string;
  projectCode?: string | null;
  ownerDetails?: string | null;
  websiteCredential?: string | null;
  contactPerson?: string | null;
  status: boolean;
}
