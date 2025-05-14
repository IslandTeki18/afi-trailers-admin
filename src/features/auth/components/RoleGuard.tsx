import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/auth.types";

interface RoleGuardProps {
  element: React.ReactElement;
  allowedRoles: Array<User["role"]>;
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  element,
  allowedRoles,
  fallbackPath = "/",
}) => {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} />;
  }

  return element;
};
