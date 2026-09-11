import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectUserRole,
  selectAuthChecked,
} from "../features/auth/authSlice";

import { useGetMeQuery } from "../features/auth/authApi";

const ProtectedRoutes = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const authChecked = useSelector(selectAuthChecked);

  const location = useLocation();

  // Check/restore authentication from the HttpOnly cookie
  const {
    isLoading,
    isFetching,
  } = useGetMeQuery();

  // Wait until authentication has been checked
  if (!authChecked || isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Authentication check has finished and user is not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User is authenticated but doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;