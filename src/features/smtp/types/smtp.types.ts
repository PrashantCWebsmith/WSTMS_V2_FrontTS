// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core entity used for persistence.
export interface SMTPModel {
  smtpidp: number;
  smtp: string;
  portNo: number;
  userName: string;
  password?: string;
  enableSSL: boolean;
  status: boolean;
}

// ViewModel: Represents the data structure used for display in the UI.
export interface SMTPViewModel {
  smtpidp: number;
  smtp: string;
  portNo: number;
  userName: string;
  password?: string;
  enableSSL: boolean;
  status: boolean;
}

// SaveModel: Represents the payload for creating or updating an entity.
export interface SMTPSaveModel {
  smtpidp?: number;
  smtp: string;
  portNo: number;
  userName: string;
  password?: string;
  enableSSL: boolean;
  status: boolean;
}

