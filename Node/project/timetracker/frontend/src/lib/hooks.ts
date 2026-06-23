'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api, unwrap } from './api-client';
import type {
  ConsistencyReport,
  Goal,
  Paginated,
  Plan,
  Subscription,
  Task,
  TaskStatus,
  TimeEntry,
  TimeSummary,
} from './types';

// ---------------------------------------------------------------- Tasks
export function useTasks(status?: TaskStatus) {
  return useQuery({
    queryKey: ['tasks', status ?? 'all'],
    queryFn: () =>
      unwrap<Paginated<Task>>(
        api.get('/tasks', { params: { status, limit: 100 } }),
      ),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Task>) => unwrap<Task>(api.post('/tasks', body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Task> & { id: string }) =>
      unwrap<Task>(api.patch(`/tasks/${id}`, body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// ------------------------------------------------------------ Time tracking
export function useActiveTimer() {
  return useQuery({
    queryKey: ['timer', 'active'],
    queryFn: () => unwrap<TimeEntry | null>(api.get('/time-entries/active')),
    refetchInterval: 15_000,
  });
}

export function useTimeSummary() {
  return useQuery({
    queryKey: ['timer', 'summary'],
    queryFn: () => unwrap<TimeSummary>(api.get('/time-entries/summary')),
  });
}

export function useStartTimer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { taskId?: string; description?: string }) =>
      unwrap<TimeEntry>(api.post('/time-entries/start', body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timer'] }),
  });
}

export function useStopTimer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap<TimeEntry>(api.post('/time-entries/stop', {})),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timer'] }),
  });
}

// ---------------------------------------------------------------- Goals
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => unwrap<Goal[]>(api.get('/goals')),
  });
}

export function useConsistency() {
  return useQuery({
    queryKey: ['goals', 'consistency'],
    queryFn: () => unwrap<ConsistencyReport>(api.get('/goals/consistency')),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; targetMinutes: number }) =>
      unwrap<Goal>(api.post('/goals', body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useLogProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, minutes }: { id: string; minutes: number }) =>
      api.post(`/goals/${id}/progress`, { minutes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/goals/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

// ----------------------------------------------------------- Subscriptions
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => unwrap<Plan[]>(api.get('/subscriptions/plans')),
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () =>
      unwrap<Subscription | null>(api.get('/subscriptions/me')),
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) =>
      unwrap<Subscription>(api.post('/subscriptions', { planId })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });
}
