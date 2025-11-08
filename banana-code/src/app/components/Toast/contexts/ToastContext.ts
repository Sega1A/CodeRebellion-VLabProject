import { createContext } from "react";
import { ToastContextType } from "../types/ToastContextType";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
