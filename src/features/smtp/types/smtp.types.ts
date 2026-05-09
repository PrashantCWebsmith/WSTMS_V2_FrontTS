export interface SMTPCreateUpdateDto {
  smtpidp?: number;
  smtp: string;
  portNo: number;
  userName: string;
  password?: string;
  enableSSL: boolean;
  status: boolean;
}

export interface SMTPListDto {
  smtpidp: number;
  smtp: string;
  portNo: number;
  userName: string;
  enableSSL: boolean;
  status: boolean;
}

export interface SMTPDto {
  smtpidp: number;
  smtp: string;
  portNo: number;
  userName: string;
  password?: string;
  enableSSL: boolean;
  status?: boolean | null;
  createdDateTime?: string | null;
}

