export interface StartTimerPayload {
  userId: string;
  taskId?: string;
  description?: string;
}

export interface StopTimerPayload {
  userId: string;
  id?: string;
}

export interface CreateTimeEntryPayload {
  userId: string;
  taskId?: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface ListTimeEntriesPayload {
  userId: string;
  taskId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ActiveTimerPayload {
  userId: string;
}

export interface SummaryPayload {
  userId: string;
  from?: string;
  to?: string;
}

export interface DeleteTimeEntryPayload {
  userId: string;
  id: string;
}

export interface DailySummary {
  date: string;
  seconds: number;
}

export interface TimeSummary {
  totalSeconds: number;
  totalMinutes: number;
  entryCount: number;
  daily: DailySummary[];
}
