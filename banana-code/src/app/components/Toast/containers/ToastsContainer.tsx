import React from "react";
import { ToastsContainerProps } from "../types/ToastContainerProps";
import { getToastStyles } from "../types/ToastStyles";

export const ToastsContainer: React.FC<ToastsContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col-reverse space-y-3 space-y-reverse pointer-events-none">
      {toasts.map((toast) => {
        const { bg } = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`
              ${bg} text-gray-800 p-4 rounded-lg shadow-xl min-w-[320px] max-w-sm 
              transition-all duration-300 transform translate-x-0 opacity-100
              pointer-events-auto cursor-pointer
            `}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center">
              <p>{toast.message}</p>
              <button
                className="ml-auto text-gray-800/70 hover:text-gray-950 px-2"
                aria-label="Cerrar notificación"
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
