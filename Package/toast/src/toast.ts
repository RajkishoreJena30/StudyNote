import { toastStore } from "./core/store";
import { Toast, ToastHandle, ToastOptions, ToastPromiseOptions, ToastType } from "./core/types";

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION = 'top-right' as const;

function createToast(type: ToastType | 'loading', message: string, options?: ToastOptions): ToastHandle {
    const base: Omit<Toast, 'id' | 'createdAt' | 'isVisible'> = {
        type: type as ToastType,
        message,
        duration: options?.duration ?? DEFAULT_DURATION,
        position: options?.position ?? DEFAULT_POSITION,
        pauseOnHover: options?.pauseOnHover ?? true,
    };
    if (options?.actions !== undefined) {
        base.actions = options.actions;
    }
    const id = toastStore.add(base);
    return {
        id,
        dismiss: () => toastStore.dismiss(id),
        update: (opts) => toastStore.update(id, opts),
    };
}

// ---- Public Imperative API ----
export const toast = {
    success: (message: string, options?: ToastOptions) =>
        createToast('success', message, options),

    error: (message: string, options?: ToastOptions) =>
        createToast('error', message, { duration: 6000, ...options }),

    warning: (message: string, options?: ToastOptions) =>
        createToast('warning', message, options),

    info: (message: string, options?: ToastOptions) =>
        createToast('info', message, options),

    loading: (message: string, options?: ToastOptions) =>
        createToast('loading', message, { duration: 0, ...options }), // persistent

    // Promise-based toast — shows loading → success/error
    promise: async <T>(
        promise: Promise<T>,
        options: ToastPromiseOptions<T>,
        toastOptions?: ToastOptions
    ): Promise<T> => {
        const handle = createToast('loading', options.loading, {
            duration: 0,
            ...toastOptions,
        });

        try {
            const data = await promise;
            const successMsg =
                typeof options.success === 'function'
                    ? options.success(data)
                    : options.success;
            toastStore.update(handle.id, {
                type: 'success',
                message: successMsg,
                duration: 4000,
            });
            // Auto-dismiss after duration
            setTimeout(() => toastStore.dismiss(handle.id), 4000);
            return data;
        } catch (error) {
            const errorMsg =
                typeof options.error === 'function'
                    ? options.error(error)
                    : options.error;
            toastStore.update(handle.id, {
                type: 'error',
                message: errorMsg,
                duration: 6000,
            });
            setTimeout(() => toastStore.dismiss(handle.id), 6000);
            throw error;
        }
    },

    dismiss: (id: string) => toastStore.dismiss(id),
    clear: () => toastStore.clear(),
};