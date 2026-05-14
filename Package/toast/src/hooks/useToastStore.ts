// src/hooks/useToastStore.ts
import { useSyncExternalStore } from 'react';
import { toastStore } from '../core/store';
import { Toast } from '../core/types';

export function useToastStore(): Toast[] {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    () => [] // Server snapshot — empty on SSR
  );
}