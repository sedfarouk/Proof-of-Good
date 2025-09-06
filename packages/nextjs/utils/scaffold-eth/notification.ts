import { toast } from "react-hot-toast";

export interface NotificationOptions {
  duration?: number;
  icon?: string;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

/**
 * Custom notification function using react-hot-toast
 * @param message - The message to display
 * @param notificationType - Type of notification
 * @param options - Additional options for the notification
 */
export const notification = {
  success: (message: string, options: NotificationOptions = {}) => {
    return toast.success(message, {
      duration: options.duration || 4000,
      icon: options.icon || "🎉",
      position: options.position || "top-right",
    });
  },

  info: (message: string, options: NotificationOptions = {}) => {
    return toast(message, {
      duration: options.duration || 4000,
      icon: options.icon || "ℹ️",
      position: options.position || "top-right",
    });
  },

  warning: (message: string, options: NotificationOptions = {}) => {
    return toast(message, {
      duration: options.duration || 5000,
      icon: options.icon || "⚠️",
      position: options.position || "top-right",
      style: {
        background: "#fef3c7",
        color: "#92400e",
      },
    });
  },

  error: (message: string, options: NotificationOptions = {}) => {
    return toast.error(message, {
      duration: options.duration || 6000,
      icon: options.icon || "❌",
      position: options.position || "top-right",
    });
  },

  loading: (message: string, options: NotificationOptions = {}) => {
    return toast.loading(message, {
      icon: options.icon || "⏳",
      position: options.position || "top-right",
    });
  },

  remove: (toastId: string) => {
    toast.dismiss(toastId);
  },

  removeAll: () => {
    toast.dismiss();
  },
};

/**
 * Wrapper for transaction notifications
 */
export const transactionNotification = {
  pending: (message: string = "Transaction pending...") => {
    return notification.loading(message, { icon: "🔄" });
  },

  success: (message: string = "Transaction successful!") => {
    return notification.success(message, { icon: "✅" });
  },

  error: (message: string = "Transaction failed") => {
    return notification.error(message, { icon: "❌" });
  },
};

/**
 * Contract interaction notifications
 */
export const contractNotification = {
  connecting: (message: string = "Connecting to contract...") => {
    return notification.loading(message, { icon: "🔗" });
  },

  success: (message: string = "Contract interaction successful!") => {
    return notification.success(message, { icon: "📄" });
  },

  error: (message: string = "Contract interaction failed") => {
    return notification.error(message, { icon: "⚠️" });
  },
};

export default notification;
