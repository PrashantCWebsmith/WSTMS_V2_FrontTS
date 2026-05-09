export interface ApiResponse<T = any> {
  success: boolean;
  message?: string | null;
  error?: string | null;
  data?: T | null;
  statusCode: number;
  code: number;
}

export interface SQLReturnMessageNValue {
  outval: any;
  outmsg: string;
}

export enum ActionStatusEnum {
  Status = 'Status',
  Delete = 'Delete'
}

export interface ActionRequestDto {
  id: number;
  action: ActionStatusEnum;
}
