import { useParams, Link } from "react-router-dom";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

import { useGetUserProfileQuery } from "../../features/profiles/profileApi";
import { useGetUserPostsQuery } from "../../features/posts/postApi";
import { useFollowUserMutation, useUnfollowUserMutation } from "../../features/follows/followApi";
import PostCard from "./PostCard";

const formatJoinDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const ViewUserProfile = () => {
  const { userId } = useParams();
  const { data, isLoading, isError } = useGetUserProfileQuery(userId);
  const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(userId, { skip: !userId });
  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7FB]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-200 border-t-[#A855F7]" />
      </div>
    );
  }

  if (isError || !data?.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7FB] px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#12111A]">User not found</h2>
        </div>
      </div>
    );
  }

  const profile = data.profile;
  const initials = (profile.full_name || profile.username || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-12 text-[#12111A]">
      <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-[#12111A]">
        {profile.cover_image ? (
          <img src={profile.cover_image} alt="cover" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#12111A] via-[#32145F] to-[#A855F7]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 pb-6 pt-0 sm:px-7">
              <div className="flex items-end justify-between">
                <div className="relative -mt-14 sm:-mt-16">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-[5px] border-white bg-slate-100 shadow-lg">
                    {profile.profile_image ? (
                      <img src={profile.profile_image} alt={profile.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-50 text-4xl font-bold text-[#A855F7]">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => (profile.is_following ? unfollow(profile.id) : follow(profile.id))}
                  className={`mb-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                    profile.is_following
                      ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      : "bg-[#A855F7] text-white hover:bg-[#9333EA]"
                  }`}
                >
                  {profile.is_following ? "Following" : "Follow"}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profile.full_name}</h1>
                  <MdVerified size={20} className="text-[#A855F7]" />
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500">@{profile.username}</p>

                {profile.bio && <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">{profile.bio}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500">
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <FiMapPin size={15} className="text-[#A855F7]" />
                      {profile.location}
                    </span>
                  )}
                  {profile.created_at && (
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={15} className="text-[#A855F7]" />
                      Joined {formatJoinDate(profile.created_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-[#F8F8FA]">
                <div className="px-3 py-4 text-center">
                  <p className="text-lg font-bold">{profile.posts_count ?? 0}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">Posts</p>
                </div>
                <Link to={`/profile/${userId}/followers`} className="px-3 py-4 text-center hover:bg-white">
                  <p className="text-lg font-bold">{profile.followers_count ?? 0}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">Followers</p>
                </Link>
                <Link to={`/profile/${userId}/following`} className="px-3 py-4 text-center hover:bg-white">
                  <p className="text-lg font-bold">{profile.following_count ?? 0}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">Following</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {postsLoading && <p className="py-8 text-center text-sm text-slate-400">Loading posts...</p>}
          {posts?.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            !postsLoading && <p className="py-8 text-center text-sm text-slate-400">No posts to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfile;