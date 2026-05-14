import { Toast, ToastOptions, ToastType } from "./types";

// ─── Internal Store ───────────────────────────────────────────────────────────
// Using a module-level store with event emitter pattern
// This means toast.success() works from ANYWHERE — outside React tree too

type Listener = () => void;

class ToastStore {
    private toasts: Toast[] = [];
    private listeners = new Set<Listener>();

    //Subscribe for useSyncExternalStore
    subscribe = (listener: Listener) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener); // cleanup
    }

    getSnapshot = () => this.toasts;

    private notify() {
        this.listeners.forEach((l) => l());
    }

    add(toast: Omit<Toast, 'id' | 'createdAt' | 'isVisible'>): string {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newToast: Toast = {
            ...toast,
            id,
            createdAt: Date.now(),
            isVisible: true,
        };
        this.toasts = [newToast, ...this.toasts]; // Newest first
        this.notify();
        return id;
    }

    dismiss(id: string) {
        // Mark invisible first — triggers exit animation
        this.toasts = this.toasts.map((t) =>
            t.id === id ? { ...t, isVisible: false } : t
        );
        this.notify();

        // Remove from DOM after animation completes
        setTimeout(() => {
            this.toasts = this.toasts.filter((t) => t.id !== id);
            this.notify();
        }, 300); // Match CSS animation duration
    }

    update(id: string, options: Partial<Toast>) {
        this.toasts = this.toasts.map((t) =>
            t.id === id ? { ...t, ...options } : t
        );
        this.notify();
    }

    clear() {
        this.toasts = [];
        this.notify();
    }
}

export const toastStore = new ToastStore();