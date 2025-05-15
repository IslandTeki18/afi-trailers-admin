import * as React from "react";
import { createContext, useState, useCallback } from "react";
import { Toast, ToastProps } from "../components/Toast";

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

let toastId = 0;

interface ExtendedToastProps extends ToastProps {
  id: number;
  createdAt: number;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ExtendedToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = toastId++;
    const newToast: ExtendedToastProps = {
      ...toast,
      id,
      createdAt: Date.now(),
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col-reverse items-end gap-4 z-[100]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="transition-all duration-300 ease-in-out"
          >
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
