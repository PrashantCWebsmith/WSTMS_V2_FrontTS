// interfaces for Model, ViewModel, and Persistence.

export interface PriorityCreateUpdateDto {
  priorityIDP?: number;
  priorityName: string;
  description?: string | null;
  status: boolean;
}

export interface PriorityListDto {
  priorityIDP: number;
  priorityName: string;
  description?: string | null;
  status: boolean;
}

export interface PriorityDto {
  priorityIDP: number;
  priorityName: string;
  description?: string | null;
  status?: boolean | null;
  createdDateTime?: string | null;
}