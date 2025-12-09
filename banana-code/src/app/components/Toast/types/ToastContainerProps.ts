import { Toast } from "./ToastType";

export interface ToastsContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}
