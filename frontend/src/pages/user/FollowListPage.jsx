import { useParams, Link } from "react-router-dom";
import { useGetFollowersQuery, useGetFollowingQuery } from "../../features/follows/followApi";

const FollowListPage = ({ mode }) => {
  const { userId } = useParams();
  const followersQ = useGetFollowersQuery(userId, { skip: mode !== "followers" });
  const followingQ = useGetFollowingQuery(userId, { skip: mode !== "following" });
  const { data, isLoading } = mode === "followers" ? followersQ : followingQ;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-lg font-bold capitalize">{mode}</h1>
      <div className="mt-4 divide-y divide-slate-100">
        {isLoading && <p className="py-6 text-center text-sm text-slate-400">Loading...</p>}
        {data?.map((u) => (
          <Link key={u.id} to={`/profile/${u.id}`} className="flex items-center gap-3 py-4">
            <img src={u.profile_image || "/default-avatar.png"} className="h-11 w-11 rounded-full object-cover" alt="" />
            <div>
              <p className="text-sm font-semibold">{u.full_name}</p>
              <p className="text-xs text-slate-500">@{u.username}</p>
            </div>
          </Link>
        ))}
        {!isLoading && !data?.length && (
          <p className="py-8 text-center text-sm text-slate-400">Nobody here yet.</p>
        )}
      </div>
    </div>
  );
};

export default FollowListPage;