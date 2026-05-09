import type { CommonPagingRequestDto, PagedResult } from "@/types/paging.types";

export interface TaskCreateUpdateDto {
  taskIDP?: number;
  taskNo: string;
  projectIDF: number;
  taskTypeIDF: number;
  assignByIDF: number;
  assignToIDF?: string | null;
  taskTitle: string;
  taskDescription?: string | null;
  taskStatusIDF: number;
  priorityIDF: number;
  startDate?: string | null;
  deadlineDate?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  progressPercent: number;
  isBlocked: boolean;
  blockReason?: string | null;
  remarks?: string | null;
}

export interface TaskListDto {
  taskIDP: number;
  taskNo: string;
  taskTitle: string;
  projectIDF: number;
  assignToIDF: number;
  taskStatusIDF: number;
  priorityIDF: number;
  deadlineDate?: string | null;
  progressPercent: number;
  isBlocked: boolean;
  projectName: string;
  taskType: string;
  taskStatus: string;
  priorityName: string;
  assignBy: string;
  assignTo: string;
  isEditDelete: boolean;
  timerStatus?: boolean;
  projectCode?: string | null;
  actualHoursSeconds: number;
  estimatedHoursInSeconds: number;
}

export interface TaskDto {
  taskIDP: number;
  taskNo: string;
  projectIDF: number;
  taskTypeIDF: number;
  assignByIDF: number;
  assignToIDF?: string | null;
  taskTitle: string;
  taskDescription?: string | null;
  taskStatusIDF: number;
  priorityIDF: number;
  startDate?: string | null;
  deadlineDate?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  progressPercent: number;
  isBlocked: boolean;
  blockReason?: string | null;
  remarks?: string | null;
}

// PagingModel: Represents the paginated response containing a collection of ViewModels.
export type TaskPagingModel = PagedResult<TaskListDto>;

export interface TaskPagingFilterDto extends CommonPagingRequestDto {
  projectIDF?: number | null;
  assignToIDF?: number | null;
  taskStatusIDF?: number | null;
}
// FilterModel: Represents the filter parameters for lists.
export interface TaskFilterModel {
  projectIDF: number;
  assignToIDF: number;
  taskStatusIDF: number;
}

// Model: Supporting data structure for the main entity.
export interface ProjectLookupModel {
  projectIDP: number;
  projectName: string;
}

// Model: Supporting data structure for the main entity.
export interface UserLookupModel {
  userIDP: number;
  userName: string;
  userFullName?: string;
}

// Model: Supporting data structure for the main entity.
export interface StatusLookupModel {
  taskStatusIDP: number;
  taskStatus: string;
}

// Model: Supporting data structure for the main entity.
export interface TaskLookupsModel {
  projects: ProjectLookupModel[];
  users: UserLookupModel[];
  statuses: StatusLookupModel[];
  priorities: any[];
  taskTypes: any[];
}

// Model: Supporting data structure for the main entity.
export interface StatusHistoryModel {
  oldStatus?: string;
  newStatus: string;
  createdDateTime: string;
  statusChangedByName: string;
  remarks: string;
}

// Model: Supporting data structure for the main entity.
export interface TaskDocumentModel {
  documentIDP: number;
  documentName: string;
  documentPath: string;
  uploadedByName: string;
  createdDateTime: string;
}

// Model: Supporting data structure for the main entity.
export interface TaskCommentModel {
  taskCommentIDP: number;
  commentText: string;
  createdByName: string;
  createdDateTime: string;
}

// Model: Supporting data structure for the main entity.
export interface TaskTimeLogModel {
  taskTimeLogIDP: number;
  startTime: string;
  endTime: string;
  userName: string;
  workDescription: string;
}

// ViewModel: Represents a complex display structure containing the entity and its relations.
export interface TaskDetailedViewModel {
  task: TaskDto;
  statusHistory: StatusHistoryModel[];
  documents: TaskDocumentModel[];
  comments: TaskCommentModel[];
  timeLogs: TaskTimeLogModel[];
}
