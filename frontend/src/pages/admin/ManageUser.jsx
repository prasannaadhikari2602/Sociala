import { useState } from "react";
import {
  useGetAdminUsersQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useAdminDeleteUserMutation,
} from "../../features/users/userApi";

const ManageUser = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const { data: users, isLoading, isFetching } = useGetAdminUsersQuery({
    search,
    status: statusFilter,
  });

  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();
  const [adminDeleteUser] = useAdminDeleteUserMutation();

  const handleSuspendToggle = async (user) => {
    setBusyId(user.id);
    try {
      if (user.is_active) {
        await suspendUser(user.id).unwrap();
      } else {
        await unsuspendUser(user.id).unwrap();
      }
    } catch (err) {
      alert(err?.data?.detail || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Permanently delete @${user.username}'s account? This can't be undone.`
    );
    if (!confirmed) return;

    setBusyId(user.id);
    try {
      await adminDeleteUser(user.id).unwrap();
    } catch (err) {
      alert(err?.data?.detail || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold">Manage Users</h1>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Loading users...
                </td>
              </tr>
            )}

            {!isLoading &&
              users?.map((user) => {
                const isProtected = user.role === "admin";
                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">@{user.username}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      {user.is_verified ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={isProtected || busyId === user.id}
                          onClick={() => handleSuspendToggle(user)}
                          title={isProtected ? "Admins can't be suspended" : ""}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {user.is_active ? "Suspend" : "Unsuspend"}
                        </button>
                        <button
                          type="button"
                          disabled={isProtected || busyId === user.id}
                          onClick={() => handleDelete(user)}
                          title={isProtected ? "Admins can't be deleted here" : ""}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!isLoading && !users?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;