export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition =
| 'top-left'
| 'top-right'
| 'top-center'
| 'bottom-left'
| 'bottom-right'
| 'bottom-center';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface Toast{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    position?: ToastPosition;
    actions?: ToastAction;
    pauseOnHover?: boolean;
    createdAt: number;
    isVisible: boolean;
}

export type ToastOptions = Partial<Omit<Toast, 'id' | 'type' | 'message' | 'createdAt' | 'isVisible'>>;

// Toster Componente props
export interface ToasterProps {
  position?: ToastPosition;
  maxVisible?: number;        // Default 5
  defaultDuration?: number;   // Default 4000ms
  containerClassName?: string;
  toastClassName?: string;
  gap?: number;               // px between toasts
  richColors?: boolean;       // Use semantic colors per type
  closeButton?: boolean;      // Show X button
  expand?: boolean;           // Stack vs expand on hover
}

// Imperative API return type — useful for promise toasts
export interface ToastHandle {
  id: string;
  dismiss: () => void;
  update: (options: Partial<Toast>) => void;
}

// Promise toast options
export interface ToastPromiseOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
}