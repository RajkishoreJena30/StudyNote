'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { formatClock, formatDuration, elapsedSeconds } from '@/lib/format';
import { useActiveTimer, useStartTimer, useStopTimer } from '@/lib/hooks';

// One focus block = a 25-minute pomodoro. The ring fills over a block and
// resets for the next, while the digits keep counting total elapsed time.
const SESSION_SECONDS = 25 * 60;
const PRESETS = ['Deep work', 'Writing', 'Studying', 'Planning'];

export function TimerWidget() {
  const { data: active } = useActiveTimer();
  const start = useStartTimer();
  const stop = useStopTimer();
  const [description, setDescription] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active?.isRunning) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [active?.isRunning]);

  const running = active?.isRunning ? active : null;
  const elapsed = running ? elapsedSeconds(running.startTime) : 0;
  const sessionElapsed = elapsed % SESSION_SECONDS;
  const progress = running ? sessionElapsed / SESSION_SECONDS : 0;
  const sessionsDone = Math.floor(elapsed / SESSION_SECONDS);
  const remaining = SESSION_SECONDS - sessionElapsed;

  // Ring geometry.
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const startedAt = running
    ? new Date(running.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        className={`pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-700 ${
          running ? 'bg-indigo-500/25 opacity-100' : 'bg-slate-500/10 opacity-60'
        }`}
      />

      <div className="relative flex items-center justify-between">
        <h2 className="text-lg font-semibold">Focus Timer</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            running
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-slate-700/60 text-slate-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              running ? 'animate-pulse bg-emerald-400' : 'bg-slate-500'
            }`}
          />
          {running ? 'Focusing' : 'Idle'}
        </span>
      </div>

      {/* Circular timer */}
      <div className="relative mx-auto mt-6 flex h-44 w-44 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={running ? dashOffset : circumference}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center">
          <p className="font-mono text-4xl font-semibold tabular-nums text-slate-50">
            {running ? formatClock(elapsed) : '00:00'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {running
              ? `${formatDuration(remaining)} left in block`
              : 'Ready when you are'}
          </p>
        </div>
      </div>

      {/* Session dots */}
      {running && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < sessionsDone % 4 ||
                (sessionsDone % 4 === 0 && sessionsDone > 0 && i === 3)
                  ? 'w-5 bg-indigo-400'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 truncate text-center text-sm text-slate-400">
        {running
          ? (running.description ?? 'Tracking your focus…')
          : 'No timer running'}
      </p>
      {startedAt && (
        <p className="mt-0.5 text-center text-xs text-slate-600">
          Started at {startedAt} · {sessionsDone} block
          {sessionsDone === 1 ? '' : 's'} done
        </p>
      )}

      {!running && (
        <div className="mt-5">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on?"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDescription(preset)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  description === preset
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        {running ? (
          <Button
            variant="danger"
            className="w-full"
            onClick={() => stop.mutate()}
            disabled={stop.isPending}
          >
            {stop.isPending ? 'Stopping…' : 'Stop & save'}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() =>
              start.mutate(
                { description: description || undefined },
                { onSuccess: () => setDescription('') },
              )
            }
            disabled={start.isPending}
          >
            {start.isPending ? 'Starting…' : '▶  Start focusing'}
          </Button>
        )}
      </div>
    </Card>
  );
}
