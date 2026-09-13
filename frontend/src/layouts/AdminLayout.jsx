import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLogOut, FiBarChart2, FiUsers, FiFileText, FiFlag } from "react-icons/fi";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useLogoutUserMutation } from "../features/auth/authApi";
import { useGetAdminReportsQuery } from "../features/reports/reportApi";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiBarChart2 },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/posts", label: "Posts", icon: FiFileText },
  { to: "/admin/reports", label: "Reports", icon: FiFlag, showCount: true },
];

const AdminLayout = () => {
  const user = useSelector(selectCurrentUser);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  // Powers the "Reports (n)" badge in the nav — same pending-reports query
  // the Reports page itself uses, so it stays in sync via cache invalidation
  // whenever a report gets resolved.
  const { data: pendingReports } = useGetAdminReportsQuery("pending");
  const pendingCount = pendingReports?.length || 0;

  const handleLogout = async () => {
    await logoutUser().unwrap().catch(() => {});
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/admin/dashboard" className="text-lg font-semibold text-white">
            Sociala Admin
          </NavLink>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              {user?.first_name || user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              <FiLogOut /> Log out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-6">
          {NAV_ITEMS.map(({ to, label, icon: Icon, showCount }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-indigo-400 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <Icon size={16} />
              {label}
              {showCount && pendingCount > 0 && (
                <span className="rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;