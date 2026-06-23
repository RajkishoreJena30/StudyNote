'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' &&
          'bg-indigo-500 text-white hover:bg-indigo-600',
        variant === 'outline' &&
          'border border-slate-600 text-slate-200 hover:bg-slate-800',
        variant === 'ghost' && 'text-slate-300 hover:bg-slate-800',
        variant === 'danger' && 'bg-red-500/90 text-white hover:bg-red-600',
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500',
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone === 'default' && 'bg-slate-700/60 text-slate-200',
        tone === 'success' && 'bg-emerald-500/15 text-emerald-300',
        tone === 'warning' && 'bg-amber-500/15 text-amber-300',
        tone === 'danger' && 'bg-red-500/15 text-red-300',
        tone === 'info' && 'bg-indigo-500/15 text-indigo-300',
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}
