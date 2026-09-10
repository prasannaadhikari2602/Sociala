import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useLogoutUserMutation } from "../features/auth/authApi";

const UserLayout = () => {
  const user = useSelector(selectCurrentUser);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser().unwrap().catch(() => {});
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/dashboard" className="text-lg font-semibold text-slate-900">
            Sociala
          </NavLink>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.first_name || user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              <FiLogOut /> Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;