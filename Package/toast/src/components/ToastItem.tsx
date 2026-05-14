import React from 'react';
import { toastStore } from '../core/store';
import { useTimer } from '../hooks/useTimer';
import { Toast, ToastType } from '../core/types';
import { ProgressBar } from './ProgressBar';

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️',
};

interface ToastItemProps {
  toast: Toast;
  index: number;
  expand: boolean;
  richColors: boolean;
  closeButton: boolean;
  className?: string;
  defaultDuration: number;
}

export function ToastItem({
  toast,
  richColors,
  closeButton,
  className,
  defaultDuration,
}: ToastItemProps) {
  const duration = toast.duration ?? defaultDuration;
  const dismiss = () => toastStore.dismiss(toast.id);

  const timerHandlers = useTimer({
    duration,
    onExpire: dismiss,
    pauseOnHover: toast.pauseOnHover ?? true,
  });

  return (
    <div
      role="alert"
      aria-atomic="true"
      data-type={toast.type}
      data-visible={String(toast.isVisible)}
      data-rich={String(richColors)}
      className={`toast-item ${className ?? ''}`}
      style={{ pointerEvents: 'all' }}
      {...timerHandlers}
    >
      {/* Icon */}
      <span className="toast-icon" aria-hidden="true">
        {ICONS[toast.type]}
      </span>

      {/* Content */}
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>

        {toast.actions && (
          <button
            className="toast-action"
            onClick={() => {
              toast.actions?.onClick();
              dismiss();
            }}
          >
            {toast.actions.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {closeButton && (
        <button
          className="toast-close"
          onClick={dismiss}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}

      {/* Progress bar — only for auto-dismiss toasts */}
      {duration > 0 && (
        <ProgressBar duration={duration} paused={false} />
      )}
    </div>
  );
}