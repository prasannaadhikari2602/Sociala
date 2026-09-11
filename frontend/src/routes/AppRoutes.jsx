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
import AdminDashboard from "../pages/admin/AdminDashboard";

import PageNotFound from "../pages/error/PageNotFound";
import UnauthorizedAccess from "../pages/error/UnauthorizedAccess";
import EmailVerifyResendRequest from "../pages/public/EmailVerifyResendRequest";
import AuthLayout from "../layouts/AuthLayout";

import Feed from "../pages/user/Feed";
import UserProfile from "../pages/user/UserProfile";
import ProfileSetup from "../pages/user/ProfileSetup";
import UserNotification from "../pages/user/UserNotification";
import Posts from "../pages/user/Posts";
import PostDetails from "../pages/user/PostDetails";
import UserSettings from "../pages/user/UserSettings";
import UserExplore from "../pages/user/UserExplore";

const AppRoutes = createBrowserRouter([
  // =========================
  // PUBLIC ROUTES
  // =========================
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },

  // =========================
  // AUTH ROUTES
  // =========================
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/email-verify",
        element: <EmailVerify />,
      },
      {
        path: "/email-verify-resend-request",
        element: <EmailVerifyResendRequest />,
      },
      {
        path: "/password-reset",
        element: <PasswordResetRequest />,
      },
      {
        path: "/password-reset/confirm",
        element: <PasswordResetConfirm />,
      },
    ],
  },

  // =========================
  // USER ROUTES
  // =========================
  {
    element: <ProtectedRoutes allowedRoles={["user"]} />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {path: '/user/home', element:<Feed />},
          {
            path: "/feed",
            element: <Feed />,
          },
          {
            path: "/userExplore",
            element: <UserExplore />,
          },
          {
            path: "/profile",
            element: <UserProfile />,
          },
          {
            path: "/profile-setup",
            element: <ProfileSetup />,
          },
          {
            path: "/notification",
            element: <UserNotification />,
          },
          {
            path: "/posts",
            element: <Posts />,
          },
          {
            path: "/postDetails",
            element: <PostDetails />,
          },
          {
            path: "/settings",
            element: <UserSettings />,
          },
        ],
      },
    ],
  },

  // =========================
  // ADMIN ROUTES
  // =========================
  {
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },

  // =========================
  // ERROR ROUTES
  // =========================
  {
    path: "/unauthorized",
    element: <UnauthorizedAccess />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default AppRoutes;