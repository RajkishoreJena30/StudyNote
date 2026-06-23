'use client';

import { FormEvent, useState } from 'react';
import { Badge, Button, Card, Input, Stat } from '@/components/ui';
import { formatMinutes } from '@/lib/format';
import {
  useConsistency,
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useLogProgress,
} from '@/lib/hooks';

export default function GoalsPage() {
  const { data: goals } = useGoals();
  const { data: consistency } = useConsistency();
  const createGoal = useCreateGoal();
  const logProgress = useLogProgress();
  const deleteGoal = useDeleteGoal();

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(60);

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal.mutate(
      { title, targetMinutes: Number(target) },
      { onSuccess: () => setTitle('') },
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Goals &amp; Focus</h1>
        <p className="text-slate-400">
          Set daily targets and build unbreakable streaks.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Consistency score"
          value={`${consistency?.consistencyScore ?? 0}%`}
          hint="last 30 days"
        />
        <Stat
          label="Focused (30d)"
          value={formatMinutes(consistency?.totalMinutesLast30Days ?? 0)}
        />
        <Stat
          label="Longest streak"
          value={consistency?.longestCurrentStreak ?? 0}
          hint="days"
        />
      </div>

      <Card>
        <form onSubmit={onCreate} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New goal (e.g. Deep work)"
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={5}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-slate-400">min/day</span>
          </div>
          <Button type="submit" disabled={createGoal.isPending}>
            Add goal
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {goals?.map((goal) => (
          <Card key={goal.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{goal.title}</p>
              <p className="text-xs text-slate-500">
                Target {formatMinutes(goal.targetMinutes)} · best{' '}
                {goal.longestStreak} days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={goal.currentStreak > 0 ? 'success' : 'default'}>
                🔥 {goal.currentStreak} day streak
              </Badge>
              <Button
                variant="outline"
                onClick={() =>
                  logProgress.mutate({
                    id: goal.id,
                    minutes: goal.targetMinutes,
                  })
                }
              >
                Log {formatMinutes(goal.targetMinutes)}
              </Button>
              <Button variant="ghost" onClick={() => deleteGoal.mutate(goal.id)}>
                🗑
              </Button>
            </div>
          </Card>
        ))}
        {goals?.length === 0 && (
          <p className="text-slate-500">
            No goals yet. Add one above and start your streak today.
          </p>
        )}
      </div>
    </div>
  );
}
