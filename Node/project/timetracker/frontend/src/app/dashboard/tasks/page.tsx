'use client';

import { FormEvent, useState } from 'react';
import { Badge, Button, Card, Input } from '@/components/ui';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from '@/lib/hooks';
import type { Priority, TaskStatus } from '@/lib/types';

const STATUS_TONE: Record<TaskStatus, 'default' | 'info' | 'success'> = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  DONE: 'success',
  ARCHIVED: 'default',
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO',
  ARCHIVED: 'TODO',
};

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      { title, priority },
      { onSuccess: () => setTitle('') },
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-slate-400">
          Break your work into focused, trackable pieces.
        </p>
      </header>

      <Card>
        <form onSubmit={onCreate} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            className="flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <Button type="submit" disabled={createTask.isPending}>
            Add task
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {isLoading && <p className="text-slate-500">Loading tasks…</p>}
        {tasks?.data.map((task) => (
          <Card key={task.id} className="flex items-center justify-between">
            <div>
              <p
                className={
                  task.status === 'DONE'
                    ? 'font-medium text-slate-500 line-through'
                    : 'font-medium'
                }
              >
                {task.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
                <Badge
                  tone={task.priority === 'HIGH' ? 'danger' : 'default'}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateTask.mutate({
                    id: task.id,
                    status: NEXT_STATUS[task.status],
                  })
                }
              >
                → {NEXT_STATUS[task.status].replace('_', ' ')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => deleteTask.mutate(task.id)}
              >
                🗑
              </Button>
            </div>
          </Card>
        ))}
        {tasks?.data.length === 0 && (
          <p className="text-slate-500">No tasks yet. Add your first above.</p>
        )}
      </div>
    </div>
  );
}
