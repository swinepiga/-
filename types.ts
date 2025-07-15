
export interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export enum SubmissionStatus {
  Idle,
  Loading,
  Success,
  Error,
}
