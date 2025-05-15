import { AppRoutes } from "./routes";
import { AuthProvider } from "@/features/auth";
import { ToastProvider } from "./contexts/ToastProvider";

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
