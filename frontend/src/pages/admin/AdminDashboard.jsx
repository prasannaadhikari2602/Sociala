import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
      <p className="mt-2 text-slate-600">
        Signed in as {user?.email} ({user?.role || "admin"}).
      </p>
    </section>
  );
};

export default AdminDashboard;