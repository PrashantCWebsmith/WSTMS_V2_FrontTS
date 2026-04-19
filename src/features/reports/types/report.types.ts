// interfaces for Model, ViewModel, and Persistence.

// ViewModel: Represents the data structure used for display in the UI.
export interface TimeTrackingViewModel {
  taskIDP: number;
  taskNo: string;
  taskTitle: string;
  projectName: string;
  taskType: string;
  assignByName: string;
  assignToName: string;
  taskStatus: string;
  priorityIDF: string | number;
  startDate: string;
  deadlineDate: string;
  estimatedHoursInSeconds: number;
  actualHoursSeconds: number;
  progressPercent: number;
}

// FilterModel: Represents the filter parameters for reports.
export interface TimeTrackingFilterModel {
  projectIDF: number;
  taskTypeIDF: number;
  assignToIDF: number;
  priorityIDF: number;
  taskStatusIDF: number;
  fromSystemDate: string;
  toSystemDate: string;
}
