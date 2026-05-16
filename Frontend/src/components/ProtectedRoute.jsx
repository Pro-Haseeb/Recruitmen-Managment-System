import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userStr || !token) {
    // Not logged in
    return <Navigate to="/auth" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/auth" replace />;
  }

  const role = typeof user.role === "string" ? user.role.toLowerCase() : "";

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but not authorized
    // Route them back to home or a generic unauthorized page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
