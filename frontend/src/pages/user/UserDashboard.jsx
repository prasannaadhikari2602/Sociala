import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const UserDashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome{user?.first_name ? `, ${user.first_name}` : ""}
      </h1>
      <p className="mt-2 text-slate-600">This is your dashboard.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-medium text-slate-500">Account</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-slate-500">Email:</dt>
            <dd className="text-slate-900">{user?.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-500">Role:</dt>
            <dd className="text-slate-900">{user?.role || "user"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default UserDashboard;