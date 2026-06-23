'use client';

import { Badge, Card, Stat } from '@/components/ui';
import { TimerWidget } from '@/components/timer-widget';
import { ConsistencyHeatmap } from '@/components/consistency-heatmap';
import { useAuth } from '@/lib/auth-context';
import { formatMinutes } from '@/lib/format';
import {
  useConsistency,
  useGoals,
  useTasks,
  useTimeSummary,
} from '@/lib/hooks';

export default function OverviewPage() {
  const { user } = useAuth();
  const { data: summary } = useTimeSummary();
  const { data: consistency } = useConsistency();
  const { data: tasks } = useTasks();
  const { data: goals } = useGoals();

  const openTasks =
    tasks?.data.filter((t) => t.status !== 'DONE' && t.status !== 'ARCHIVED')
      .length ?? 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">
          Hey {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400">Here&apos;s how your focus is going.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Focused this week"
          value={formatMinutes(summary?.totalMinutes ?? 0)}
          hint={`${summary?.entryCount ?? 0} sessions`}
        />
        <Stat
          label="Consistency score"
          value={`${consistency?.consistencyScore ?? 0}%`}
          hint={`${consistency?.daysActiveLast30Days ?? 0} active days / 30`}
        />
        <Stat
          label="Longest streak"
          value={consistency?.longestCurrentStreak ?? 0}
          hint="days in a row"
        />
        <Stat label="Open tasks" value={openTasks} hint="to do or in progress" />
      </div>

      <ConsistencyHeatmap
        score={consistency?.consistencyScore ?? 0}
        activeDays={consistency?.daysActiveLast30Days ?? 0}
        data={consistency?.dailyActivity ?? []}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TimerWidget />
        </div>

        <Card className="lg:col-span-2">
          {(() => {
            const days = summary?.daily ?? [];
            const maxSeconds = Math.max(1, ...days.map((d) => d.seconds));
            const totalSeconds = days.reduce((sum, d) => sum + d.seconds, 0);
            const activeDays = days.filter((d) => d.seconds > 0).length;
            const avgSeconds = activeDays ? totalSeconds / activeDays : 0;
            const best = days.reduce<{ date: string; seconds: number } | null>(
              (top, d) => (!top || d.seconds > top.seconds ? d : top),
              null,
            );
            const todayKey = new Date().toISOString().slice(0, 10);
            const weekday = (iso: string) =>
              new Date(`${iso}T00:00:00`).toLocaleDateString([], {
                weekday: 'short',
              });

            return (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      This week&apos;s focus
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {formatMinutes(Math.round(totalSeconds / 60))} across{' '}
                      {activeDays} day{activeDays === 1 ? '' : 's'}
                    </p>
                  </div>
                  {best && best.seconds > 0 && (
                    <Badge tone="success">
                      Best {weekday(best.date)} ·{' '}
                      {formatMinutes(Math.round(best.seconds / 60))}
                    </Badge>
                  )}
                </div>

                {days.length === 0 ? (
                  <div className="mt-6 flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 text-center">
                    <p className="text-sm text-slate-400">
                      No focus time logged yet this week.
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Start the timer and your daily activity will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="relative mt-6 h-44">
                    {/* average reference line */}
                    {avgSeconds > 0 && (
                      <div
                        className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700/70"
                        style={{
                          bottom: `${(avgSeconds / maxSeconds) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-2 right-0 bg-slate-900/60 px-1 text-[10px] text-slate-500">
                          avg {formatMinutes(Math.round(avgSeconds / 60))}
                        </span>
                      </div>
                    )}

                    <div className="flex h-full items-end gap-2">
                      {days.map((d) => {
                        const minutes = Math.round(d.seconds / 60);
                        const height = (d.seconds / maxSeconds) * 100;
                        const isToday = d.date === todayKey;
                        const hasValue = d.seconds > 0;
                        return (
                          <div
                            key={d.date}
                            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                          >
                            <span
                              className={`text-[10px] font-medium tabular-nums transition-opacity ${
                                hasValue
                                  ? 'text-slate-400 opacity-0 group-hover:opacity-100'
                                  : 'text-transparent'
                              }`}
                            >
                              {minutes}m
                            </span>
                            <div
                              className={`w-full rounded-md bg-linear-to-t transition-all duration-300 ${
                                isToday
                                  ? 'from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-500/20'
                                  : hasValue
                                    ? 'from-indigo-500/60 to-indigo-400/80 group-hover:from-indigo-500 group-hover:to-cyan-400'
                                    : 'from-slate-800 to-slate-800'
                              }`}
                              style={{
                                height: `${hasValue ? Math.max(6, height) : 4}%`,
                              }}
                              title={`${weekday(d.date)}: ${formatMinutes(minutes)}`}
                            />
                            <span
                              className={`text-[11px] ${
                                isToday
                                  ? 'font-semibold text-indigo-300'
                                  : 'text-slate-500'
                              }`}
                            >
                              {weekday(d.date)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active goals</h2>
          <Badge tone="info">{goals?.filter((g) => g.isActive).length ?? 0}</Badge>
        </div>
        <ul className="mt-4 space-y-3">
          {goals?.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
            >
              <div>
                <p className="font-medium">{goal.title}</p>
                <p className="text-xs text-slate-500">
                  Target {formatMinutes(goal.targetMinutes)} · {goal.type}
                </p>
              </div>
              <Badge tone={goal.currentStreak > 0 ? 'success' : 'default'}>
                🔥 {goal.currentStreak} day streak
              </Badge>
            </li>
          ))}
          {goals?.length === 0 && (
            <p className="text-sm text-slate-500">
              No goals yet — create one to start building consistency.
            </p>
          )}
        </ul>
      </Card>
    </div>
  );
}
