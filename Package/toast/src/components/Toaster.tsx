import React from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '../hooks/useToastStore';
import { ToastItem } from './ToastItem';
import { ToasterProps, ToastPosition } from '../core/types';
import { isBottomPosition } from '../core/utils';

const POSITION_STYLES: Record<ToastPosition, React.CSSProperties> = {
  'top-left':      { top: 16, left: 16 },
  'top-center':    { top: 16, left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: 16, right: 16 },
  'bottom-left':   { bottom: 16, left: 16 },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: 16, right: 16 },
};

export function Toaster({
  position = 'top-right',
  maxVisible = 5,
  defaultDuration = 4000,
  containerClassName,
  toastClassName,
  gap = 8,
  richColors = true,
  closeButton = true,
  expand = false,
}: ToasterProps) {
  const allToasts = useToastStore();

  // SSR guard — document is undefined on the server
  if (typeof document === 'undefined') return null;

  // Only show toasts targeting this Toaster's position, up to maxVisible
  const visibleToasts = allToasts
    .filter((t) => (t.position ?? 'top-right') === position)
    .slice(0, maxVisible);

  if (visibleToasts.length === 0) return null;

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className={`toast-container ${containerClassName ?? ''}`}
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection: isBottomPosition(position) ? 'column-reverse' : 'column',
        gap,
        pointerEvents: 'none', // Container itself doesn't block clicks
        ...POSITION_STYLES[position],
      }}
    >
      {visibleToasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          expand={expand}
          richColors={richColors}
          closeButton={closeButton}
          {...(toastClassName !== undefined ? { className: toastClassName } : {})}
          defaultDuration={defaultDuration}
        />
      ))}
    </div>,
    document.body
  );
}