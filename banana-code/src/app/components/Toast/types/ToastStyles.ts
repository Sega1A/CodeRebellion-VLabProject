import { ToastType } from "./ToastType";

export const getToastStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        bg: "bg-green-50 border-green-500 text-green-800",
      };
    case "error":
      return {
        bg: "bg-red-50 border-red-500 text-red-800",
      };
    case "warning":
      return {
        bg: "bg-yellow-50 border-yellow-500 text-yellow-800",
      };
    case "info":
    default:
      return {
        bg: "bg-blue-50 border-blue-500 text-blue-800",
      };
  }
};
