"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { ToastType } from "@/contexts/NotificationContext";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: XCircle,
    iconColor: "text-red-600",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-800",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const styles = toastStyles[type];
  const Icon = styles.icon;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    return () => {
      setIsExiting(true);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        pointer-events-auto
        transform transition-all duration-500 ease-out
        ${isVisible && !isExiting 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"}
        ${styles.bg} border-2 ${styles.bg.includes('green') ? 'border-green-300' : styles.bg.includes('red') ? 'border-red-300' : styles.bg.includes('yellow') ? 'border-yellow-300' : 'border-blue-300'} rounded-xl shadow-2xl p-4 sm:p-5
        flex items-center gap-3 sm:gap-4
        w-full
        backdrop-blur-sm
        animate-slide-in-right
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.iconColor} animate-bounce-subtle`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm sm:text-base font-semibold ${styles.text} leading-relaxed`}>
          {message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-black/5`}
        aria-label="Cerrar notificación"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
