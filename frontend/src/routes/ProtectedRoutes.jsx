import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";

/**
 * Gate for role-restricted route trees.
 * Usage in AppRoutes.jsx:
 *   <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
 *     <Route element={<AdminLayout />}>...</Route>
 *   </Route>
 */
const ProtectedRoutes = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;