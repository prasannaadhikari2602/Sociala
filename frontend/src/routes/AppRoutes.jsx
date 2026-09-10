import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoutes from "./ProtectedRoutes";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import EmailVerify from "../pages/public/EmailVerify";
import PasswordResetRequest from "../pages/public/PasswordResetRequest";
import PasswordResetConfirm from "../pages/public/PasswordResetConfirm";
import Explore from "../pages/shared/Explore";

import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import PageNotFound from "../pages/error/PageNotFound";
import UnauthorizedAccess from "../pages/error/UnauthorizedAccess";

const AppRoutes = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/explore", element: <Explore /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/email-verify", element: <EmailVerify /> },
      { path: "/password-reset", element: <PasswordResetRequest /> },
      { path: "/password-reset/confirm", element: <PasswordResetConfirm /> },
    ],
  },
  {
    element: <ProtectedRoutes allowedRoles={["user"]} />,
    children: [
      {
        element: <UserLayout />,
        children: [{ path: "/dashboard", element: <UserDashboard /> }],
      },
    ],
  },
  {
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
      },
    ],
  },
  { path: "/unauthorized", element: <UnauthorizedAccess /> },
  { path: "*", element: <PageNotFound /> },
]);

export default AppRoutes;