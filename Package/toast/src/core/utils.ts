import { Toast, ToastAction, ToastOptions, ToastPosition, ToastType } from './types';

export const DEFAULT_DURATION = 4000;
export const DEFAULT_POSITION: ToastPosition = 'top-right';
export const ANIMATION_DURATION = 300; // ms — must match CSS
export const MAX_QUEUE = 20;

/** Generate a unique toast id */
export function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface MergedOptions {
  duration: number;
  position: ToastPosition;
  pauseOnHover: boolean;
  actions?: ToastAction;
}

/** Merge consumer options with defaults */
export function mergeOptions(type: ToastType, options?: ToastOptions): MergedOptions {
  const merged: MergedOptions = {
    duration: options?.duration ?? (type === 'error' ? 6000 : DEFAULT_DURATION),
    position: options?.position ?? DEFAULT_POSITION,
    pauseOnHover: options?.pauseOnHover ?? true,
  };
  if (options?.actions !== undefined) {
    merged.actions = options.actions;
  }
  return merged;
}

/** Checks whether a position is at the bottom of the screen */
export function isBottomPosition(position: ToastPosition): boolean {
  return position.startsWith('bottom');
}

/** Deduplication check — same type + message already visible */
export function isDuplicate(toasts: Toast[], type: ToastType, message: string): boolean {
  return toasts.some((t) => t.type === type && t.message === message && t.isVisible);
}