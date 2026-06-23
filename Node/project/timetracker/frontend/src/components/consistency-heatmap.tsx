'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import { formatMinutes } from '@/lib/format';

type Day = { date: string; minutes: number };

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Map focus minutes to a 0-4 intensity level (GitHub-style shades).
function level(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 25) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

const LEVEL_CLASS = [
  'bg-slate-800/80',
  'bg-emerald-900/80',
  'bg-emerald-700',
  'bg-emerald-500',
  'bg-emerald-400',
];

export function ConsistencyHeatmap({
  score,
  activeDays,
  data,
}: {
  score: number;
  activeDays: number;
  data: Day[];
}) {
  const [hover, setHover] = useState<Day | null>(null);

  // Group the flat day list into week columns aligned to Sunday so the grid
  // reads top-to-bottom (Sun→Sat) and left-to-right (oldest→newest week).
  const weeks = useMemo(() => {
    if (data.length === 0) return [] as Day[][];
    const cols: Day[][] = [];
    let current: Day[] = [];
    data.forEach((day, index) => {
      const weekday = new Date(`${day.date}T00:00:00`).getDay();
      if (index === 0 && weekday > 0) {
        // pad the first column so the first real day lands on its weekday row
        current = Array.from({ length: weekday }, () => ({
          date: '',
          minutes: -1,
        }));
      }
      current.push(day);
      if (current.length === 7) {
        cols.push(current);
        current = [];
      }
    });
    if (current.length) cols.push(current);
    return cols;
  }, [data]);

  const totalMinutes = data.reduce((sum, d) => sum + Math.max(0, d.minutes), 0);

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Consistency</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {activeDays} active days · {formatMinutes(totalMinutes)} focused in
            the last 12 weeks
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold leading-none text-emerald-400">
            {score}%
          </p>
          <p className="text-xs text-slate-500">consistency score</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {/* weekday labels */}
        <div className="flex flex-col gap-1 pt-0.5">
          {WEEKDAY_LABELS.map((label, i) => (
            <span
              key={i}
              className="h-3 text-[9px] leading-3 text-slate-600"
              style={{ minWidth: '1.5rem' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* week columns */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day || day.minutes < 0) {
                  return <span key={di} className="h-3 w-3" />;
                }
                return (
                  <span
                    key={di}
                    onMouseEnter={() => setHover(day)}
                    onMouseLeave={() => setHover(null)}
                    className={`h-3 w-3 rounded-[3px] ${LEVEL_CLASS[level(day.minutes)]} ring-1 ring-inset ring-black/20 transition-transform hover:scale-125`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="h-4 text-xs text-slate-400">
          {hover ? (
            <>
              <span className="font-medium text-slate-200">
                {hover.minutes > 0
                  ? formatMinutes(hover.minutes)
                  : 'No focus'}
              </span>{' '}
              on{' '}
              {new Date(`${hover.date}T00:00:00`).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
            </>
          ) : (
            'Hover a day to see your focus time'
          )}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span>Less</span>
          {LEVEL_CLASS.map((cls, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-[3px] ${cls} ring-1 ring-inset ring-black/20`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}
