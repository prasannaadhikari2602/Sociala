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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <NavLink
            to="/admin/dashboard"
            className="text-base font-semibold text-white sm:text-lg"
          >
            Sociala <span className="text-blue-400">Admin</span>
          </NavLink>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-slate-300 sm:inline">
              {user?.first_name || user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 sm:px-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map(({ to, label, icon: Icon, showCount }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 sm:gap-2 border-b-2 px-2.5 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-400 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <Icon size={16} />
              {label}
              {showCount && pendingCount > 0 && (
                <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
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