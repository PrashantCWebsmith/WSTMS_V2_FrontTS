// interfaces for Model, ViewModel, and Persistence.

export interface TaskStatusCreateUpdateDto {
  taskStatusIDP?: number;
  taskStatus: string;
  description?: string | null;
  status: boolean;
  isDisplayInKanban: boolean;
  sortOrder: number;
}

export interface TaskStatusListDto {
  taskStatusIDP: number;
  taskStatus: string;
  description?: string | null;
  status: boolean;
  isDisplayInKanban: boolean;
  sortOrder: number;
}

export interface TaskStatusDto {
  taskStatusIDP: number;
  taskStatus: string;
  description?: string | null;
  status?: boolean | null;
  isDisplayInKanban?: boolean | null;
  sortOrder: number;
  createdDateTime?: string | null;
}

export interface TaskStatusActionRequestDto {
  id: number;
  action: string;
}

export enum TaskStatusActionStatusEnum {
  Status = 'Status',
  Delete = 'Delete',
  Kanban = 'KANBAN'
}
