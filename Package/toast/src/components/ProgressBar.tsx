import React from 'react';

interface ProgressBarProps {
  duration: number; // ms
  paused: boolean;
}

export function ProgressBar({ duration, paused }: ProgressBarProps) {
  return (
    <div
      className="toast-progress"
      aria-hidden="true"
      style={{
        animationDuration: `${duration}ms`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    />
  );
}