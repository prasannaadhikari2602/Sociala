import { useState } from "react";
import { Link } from "react-router-dom";
import { useExploreUsersQuery, useFollowUserMutation, useUnfollowUserMutation } from "../../features/follows/followApi";

const UserExplore = () => {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useExploreUsersQuery(search);
  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search people by name or username..."
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
      />

      <div className="mt-5 divide-y divide-slate-100">
        {isLoading && <p className="py-6 text-center text-sm text-slate-400">Searching...</p>}
        {users?.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-4">
            <Link to={`/profile/${u.id}`} className="flex items-center gap-3">
              <img
                src={u.profile_image || "/default-avatar.png"}
                className="h-11 w-11 rounded-full object-cover"
                alt=""
              />
              <div>
                <p className="text-sm font-semibold">{u.full_name}</p>
                <p className="text-xs text-slate-500">@{u.username}</p>
              </div>
            </Link>

            <button
              onClick={() => (u.is_following ? unfollow(u.id) : follow(u.id))}
              className={`rounded-lg px-4 py-2 text-xs font-semibold ${
                u.is_following ? "border border-slate-200 text-slate-600" : "bg-[#A855F7] text-white"
              }`}
            >
              {u.is_following ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserExplore;