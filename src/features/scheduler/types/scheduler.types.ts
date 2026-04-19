// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface SchedulerModel {
  schedulerIDP: number;
  emailSubject: string;
  emailBody: string;
  sendToEmailIDs: string;
  ccEmailIDs: string;
  startDate: string;
  repeatType: string;
  repeatDays: string;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface SchedulerViewModel {
  schedulerIDP: number;
  emailSubject: string;
  emailBody: string;
  sendToEmailIDs: string;
  ccEmailIDs: string;
  startDate: string;
  repeatType: string;
  repeatDays: string;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface SchedulerSaveModel {
  schedulerIDP?: number;
  emailSubject: string;
  emailBody: string;
  sendToEmailIDs: string;
  ccEmailIDs: string;
  startDate: string;
  repeatType: string;
  repeatDays: string;
}