// interfaces for Model, ViewModel, and Persistence.

export interface SchedulerCreateUpdateDto {
  schedulerIDP?: number;
  emailSubject: string;
  emailBody: string;
  sendToEmailIDs: string;
  ccEmailIDs?: string | null;
  startDate: string;
  repeatType: string;
  repeatDays?: string | null;
  status: boolean;
}

export interface SchedulerListDto {
  schedulerIDP: number;
  emailSubject: string;
  sendToEmailIDs: string;
  startDate: string;
  repeatType: string;
  status: boolean;
}

export interface SchedulerDto {
  schedulerIDP: number;
  emailSubject: string;
  emailBody: string;
  sendToEmailIDs: string;
  ccEmailIDs?: string | null;
  startDate: string;
  repeatType: string;
  repeatDays?: string | null;
  status?: boolean | null;
  createdDateTime?: string | null;
}