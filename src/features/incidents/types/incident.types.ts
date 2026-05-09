export interface IncidentCreateUpdateDto {
  incidentidp?: number;
  projectIDF: number;
  taskIDF?: number | null;
  userIDF: number;
  criticalPoint?: string | null;
  nonCriticalPoint?: string | null;
  severity?: string | null;
  incidentDate: string;
  status: string;
}

export interface IncidentListDto {
  incidentidp: number;
  projectIDF: number;
  projectName?: string;
  userName?: string;
  criticalPoint?: string | null;
  severity?: string | null;
  incidentDate: string;
  status: string;
}

export interface IncidentDto {
  incidentidp: number;
  projectIDF: number;
  taskIDF?: number | null;
  userIDF: number;
  criticalPoint?: string | null;
  nonCriticalPoint?: string | null;
  severity?: string | null;
  incidentDate: string;
  status: string;
  projectName?: string | null;
  userName?: string | null;
}
