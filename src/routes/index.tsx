import { RouterProvider, createBrowserRouter } from "react-router";
import { mainRoutes } from "./main";

export function AppRoutes() {
  const router = createBrowserRouter(mainRoutes);
  return <RouterProvider router={router} />;
}
