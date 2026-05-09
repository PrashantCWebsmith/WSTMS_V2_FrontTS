export interface LeaveCreateUpdateDto {
  leaveIDP?: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description?: string | null;
  status: boolean;
}

export interface LeaveListDto {
  leaveIDP: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description?: string | null;
  status: boolean;
}

export interface LeaveDto {
  leaveIDP: number;
  leaveName: string;
  leaveCode: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  description?: string | null;
  status?: boolean | null;
  createdDateTime?: string | null;
}
