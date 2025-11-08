import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
};
