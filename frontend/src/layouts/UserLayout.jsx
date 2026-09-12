import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { useGetMyProfileQuery } from "../features/profiles/profileApi";
import UserNavbar from "../components/UserNavbar";
import PostDetails from "../pages/user/PostDetails";
import ReportPostModal from "../pages/user/ReportPostModal";

const UserLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isLoading } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
        Loading profile...
      </div>
    );
  }

  const isSetup = Boolean(data?.is_setup);
  const onSetupPage = location.pathname === "/profile-setup";

  if (!isSetup && !onSetupPage) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (isSetup && onSetupPage) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div>
      {isSetup && <UserNavbar />}
      <Outlet />

      {/* Global overlays — only meaningful once profile setup is done,
          since these dispatch off Redux state (activePostId / reportingPostId)
          that can only be set from pages behind the setup gate anyway. */}
      {isSetup && (
        <>
          <PostDetails />
          <ReportPostModal />
        </>
      )}
    </div>
  );
};

export default UserLayout;