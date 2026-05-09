export interface IncidentCreateUpdateDto {
  incidentIDP?: number;
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
  incidentIDP: number;
  projectName: string;
  userName: string;
  criticalPoint?: string | null;
  severity?: string | null;
  incidentDate: string;
  status: string;
}

export interface IncidentDto {
  incidentIDP: number;
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
