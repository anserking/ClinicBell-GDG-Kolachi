export type PatientStatus = 'new' | 'due' | 'sent' | 'completed';

export interface VisitRecord {
  id: string;
  date: string;
  text: string;
  diagnosis?: string;
  prescription?: string;
  doctorName?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  status: PatientStatus;
  note: string;
  visitsCount: number;
  lastVisit: string;
  history: VisitRecord[];
  followupEnabled?: boolean;
  followupDelay?: string;
  followupMessage?: string;
  checkedInAt?: string;
}

export interface FollowupRecord {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  diagnosisSummary: string;
  sendDate: string;
  status: 'due' | 'sent' | 'scheduled' | 'cancelled';
  delay: string;
  customMessage?: string;
}

export type ActiveView = 'today' | 'patients' | 'followups' | 'settings';
