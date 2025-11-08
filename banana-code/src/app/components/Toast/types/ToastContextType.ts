import { ToastType } from "./ToastType";

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}
