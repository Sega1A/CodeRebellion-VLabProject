"use client";

import React, { useState, useCallback } from "react";
import { Toast, ToastType } from "../types/ToastType";
import { ToastsContainer } from "../containers/ToastsContainer";
import { ToastContext } from "../contexts/ToastContext";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const TOAST_TIMEOUT = 5000; // 5 seconds

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now();
      const newToast: Toast = { id, message, type };
      setToasts((currentToasts) => [newToast, ...currentToasts]);
      setTimeout(() => {
        removeToast(id);
      }, TOAST_TIMEOUT);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastsContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
