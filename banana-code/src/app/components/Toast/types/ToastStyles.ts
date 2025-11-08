import { ToastType } from "./ToastType";

export const getToastStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        bg: "bg-green-500",
      };
    case "error":
      return {
        bg: "bg-red-600",
      };
    case "warning":
      return {
        bg: "bg-yellow-500",
      };
    case "info":
    default:
      return {
        bg: "bg-blue-500",
      };
  }
};
