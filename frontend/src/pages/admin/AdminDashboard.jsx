import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetDashboardStatsQuery } from "../../features/dashboard/dashboardApi";

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 p-5">
    <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
    <p className="mt-1 text-sm text-slate-500">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
      <p className="mt-2 text-slate-600">
        Signed in as {user?.email} ({user?.role || "admin"}).
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={stats?.total_users} />
        <StatCard label="Total Posts" value={stats?.total_posts} />
        <StatCard label="Reported Posts" value={stats?.reported_posts} />
        <StatCard label="Banned Users" value={stats?.banned_users} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Users</h2>
            <NavLink to="/admin/users" className="text-xs font-medium text-indigo-600">
              Manage users
            </NavLink>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {isLoading && <p className="text-sm text-slate-400">Loading...</p>}

            {stats?.recent_users?.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{u.username}</p>
                  <p className="text-xs text-slate-400">
                    @{u.username} · {u.role}
                  </p>
                </div>
                {u.is_active ? (
                  u.is_verified && (
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                      Verified
                    </span>
                  )
                ) : (
                  <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                    Suspended
                  </span>
                )}
              </div>
            ))}

            {!isLoading && !stats?.recent_users?.length && (
              <p className="text-sm text-slate-400">No users yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pending Reports</h2>
            <NavLink to="/admin/reports" className="text-xs font-medium text-indigo-600">
              Review all
            </NavLink>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {isLoading && <p className="text-sm text-slate-400">Loading...</p>}

            {stats?.pending_reports?.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{r.reason}</p>
                  <p className="text-xs text-slate-400">
                    Reported by @{r.reporter_username}
                  </p>
                </div>
                <NavLink
                  to="/admin/reports"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Resolve
                </NavLink>
              </div>
            ))}

            {!isLoading && !stats?.pending_reports?.length && (
              <p className="text-sm text-slate-400">Nothing pending. Nice.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;