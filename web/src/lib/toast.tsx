'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { Toast, ToastProps } from '@/components/ui/toast';
import { generateId } from './utils';

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'CLEAR_TOASTS' };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

interface ToastContextType {
  toast: (props: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const toast = useCallback((props: Omit<ToastItem, 'id'>) => {
    const id = generateId();
    const duration = props.duration ?? 5000;

    dispatch({
      type: 'ADD_TOAST',
      toast: { ...props, id },
    });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, clear }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {state.toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            {...toastItem}
            onClose={() => dismiss(toastItem.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
