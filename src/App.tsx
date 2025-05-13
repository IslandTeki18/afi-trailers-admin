import { AppRoutes } from "./routes";
import { AuthProvider } from "@/features/auth";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
