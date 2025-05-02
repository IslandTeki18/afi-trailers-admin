import { AppRoutes } from "./routes";
import { AuthProvider } from "./features/auth/context/AuthProvider";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
