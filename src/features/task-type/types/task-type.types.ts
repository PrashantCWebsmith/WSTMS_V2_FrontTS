export interface TaskTypeCreateUpdateDto {
  taskTypeIDP?: number;
  taskType: string;
  description?: string | null;
  status: boolean;
}

export interface TaskTypeListDto {
  taskTypeIDP: number;
  taskType: string;
  description?: string | null;
  status: boolean;
}

export interface TaskTypeDto {
  taskTypeIDP: number;
  taskType: string;
  description?: string | null;
  status?: boolean | null;
  createdDateTime?: string | null;
}
