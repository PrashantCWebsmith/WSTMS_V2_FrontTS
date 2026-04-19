// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface TaskModel {
  taskIDP: number;
  taskTitle: string;
  taskDescription: string;
  projectIDF: number;
  taskStatusIDF: number;
  taskTypeIDF: number;
  priorityIDF: number;
  assignToIDF: number;
  deadlineDate: string;
  startDate?: string;
  estimatedHours: number;
  actualHours: number;
  progressPercent: number;
  isBlocked: boolean;
  blockReason?: string;
  remarks?: string;
  assignByIDF?: number;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface TaskViewModel {
  taskIDP: number;
  taskNo: string;
  taskTitle: string;
  taskDescription: string;
  projectIDF: number;
  projectName: string;
  projectCode?: string;
  taskStatusIDF: number;
  taskStatus: string;
  taskTypeIDF: number;
  taskType: string;
  priorityIDF: number;
  priorityName: string;
  assignToIDF: number;
  assignTo: string; // Keep for compatibility
  assignToName?: string;
  assignByIDF: number;
  assignBy: string; // Keep for compatibility
  assignByName?: string;
  deadlineDate: string;
  startDate?: string;
  createdDate: string;
  estimatedHours: number;
  actualHours: number;
  progressPercent: number;
  isBlocked: boolean;
  blockReason?: string;
  remarks?: string;
  isEditDelete?: boolean | number;
  timerStatus?: boolean;
  totalTimeSeconds?: number;
  totalTime?: string;
  isStarted?: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface TaskSaveModel {
  taskIDP?: number;
  taskTitle: string;
  taskDescription: string;
  projectIDF: number;
  taskStatusIDF: number;
  taskTypeIDF: number;
  priorityIDF: number;
  assignToIDF: number;
  deadlineDate: string;
  startDate?: string;
  estimatedHours: number;
  actualHours: number;
  progressPercent: number;
  isBlocked: boolean;
  blockReason?: string;
  remarks?: string;
  assignByIDF?: number;
}

import type { PagedResultModel } from '@/types/paging.types';

// PagingModel: Represents the paginated response containing a collection of ViewModels.
export type TaskPagingModel = PagedResultModel<TaskViewModel>;

// FilterModel: Represents the filter parameters for lists.
export interface TaskFilterModel {
  projectIDF: number;
  assignToIDF: number;
  taskStatusIDF: number;
  searchTerm?: string;
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
  task: TaskViewModel;
  statusHistory: StatusHistoryModel[];
  documents: TaskDocumentModel[];
  comments: TaskCommentModel[];
  timeLogs: TaskTimeLogModel[];
}
