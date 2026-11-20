import { create } from "zustand";

export type ToastMessage = {
  id: string;
  message: string;
};

type ToastState = {
  toasts: ToastMessage[];
  show: (message: string) => void;
  dismiss: (id: string) => void;
};

const TOAST_MS = 4200;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, TOAST_MS);
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export function showToast(message: string): void {
  useToastStore.getState().show(message);
}
