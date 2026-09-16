import { useState } from "react";
import {
  FiEdit2,
  FiMapPin,
  FiCalendar,
  FiList,
  FiGrid,
  FiMoreHorizontal,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";

import { useGetMyProfileQuery } from "../../features/profiles/profileApi";
import { useGetMyPostsQuery } from "../../features/posts/postApi";
import EditProfileModal from "./EditProfileModal";
import FollowListPage from "./FollowListPage";
import PostDetails from "./PostDetails";

const formatJoinDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const UserProfile = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const {
    data: posts,
    isLoading: postsLoading,
  } = useGetMyPostsQuery();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [view, setView] = useState("grid");

  // "followers" | "following" | null
  const [followModalType, setFollowModalType] = useState(null);

  // holds the id of the post currently open in the detail modal
  const [selectedPostId, setSelectedPostId] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-200 border-t-[#A855F7]" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.profile) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-[#A855F7]">
            !
          </div>

          <h2 className="text-lg font-semibold text-[#12111A]">
            Couldn't load your profile
          </h2>

          <p className="mt-1 text-sm text-slate-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  const profile = data.profile;

  // Profile.id (UUID PK) and User.id are different rows — always use
  // user_id here, which the serializer now exposes explicitly.
  const profileUserId = profile.user_id;

  const initials = (profile.full_name || profile.username || "?")
    .charAt(0)
    .toUpperCase();

  const postList = Array.isArray(posts) ? posts : posts?.results ?? [];

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#12111A] pb-12">

      {/* =========================================================
          COVER
      ========================================================= */}

      <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-[#12111A]">
        {profile.cover_image ? (
          <img
            src={profile.cover_image}
            alt="Profile cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#12111A] via-[#32145F] to-[#A855F7]" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

        {!profile.cover_image && (
          <>
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#A855F7]/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-30 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
          </>
        )}

        <button
          onClick={() => setIsEditOpen(true)}
          className="
            absolute right-4 top-4
            sm:right-6 sm:top-6
            flex items-center gap-2
            rounded-xl
            border border-white/20
            bg-[#12111A]/70
            px-4 py-2.5
            text-sm font-medium text-white
            backdrop-blur-md
            transition
            hover:bg-[#12111A]
          "
        >
          <FiEdit2 size={15} />
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      </div>

      {/* =========================================================
          PROFILE CONTENT
      ========================================================= */}

      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Profile Header Card */}

        <div className="relative -mt-16 sm:-mt-20">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 pb-6 pt-0 sm:px-7">

              {/* Avatar */}

              <div className="flex items-end justify-between">
                <div className="relative -mt-14 sm:-mt-16">
                  <div className="
                    h-28 w-28
                    sm:h-32 sm:w-32
                    overflow-hidden
                    rounded-full
                    border-[5px]
                    border-white
                    bg-slate-100
                    shadow-lg
                  ">
                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt={profile.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="
                        flex h-full w-full
                        items-center justify-center
                        bg-linear-to-br
                        from-purple-100
                        to-purple-50
                        text-4xl font-bold
                        text-[#A855F7]
                      ">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="
                    absolute bottom-2 right-2
                    h-5 w-5
                    rounded-full
                    border-4 border-white
                    bg-[#A855F7]
                  " />
                </div>

                <button
                  className="
                    mb-2 rounded-xl
                    border border-slate-200
                    p-2
                    text-slate-500
                    transition
                    hover:bg-slate-50
                    sm:hidden
                  "
                  aria-label="More options"
                >
                  <FiMoreHorizontal size={19} />
                </button>
              </div>

              {/* Name + Username */}

              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[#12111A] sm:text-3xl">
                    {profile.full_name}
                  </h1>

                  <MdVerified size={20} className="text-[#A855F7]" />
                </div>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                    {profile.bio}
                  </p>
                )}

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

              {/* =====================================================
                  STATS (clickable)
              ===================================================== */}

              <div className="
                mt-6
                grid grid-cols-3
                divide-x divide-slate-200
                rounded-xl
                border border-slate-200
                bg-[#F8F8FA]
                overflow-hidden
              ">
                <div className="px-3 py-4 text-center transition hover:bg-white">
                  <p className="text-lg font-bold text-[#12111A]">
                    {profile.posts_count ?? postList.length ?? 0}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                    Posts
                  </p>
                </div>

                <button
                  onClick={() => setFollowModalType("followers")}
                  className="px-3 py-4 text-center transition hover:bg-white"
                >
                  <p className="text-lg font-bold text-[#12111A]">
                    {profile.followers_count ?? 0}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                    Followers
                  </p>
                </button>

                <button
                  onClick={() => setFollowModalType("following")}
                  className="px-3 py-4 text-center transition hover:bg-white"
                >
                  <p className="text-lg font-bold text-[#12111A]">
                    {profile.following_count ?? 0}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                    Following
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            POSTS SECTION
        ========================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">

          <div className="
            flex items-center
            justify-between
            border-b border-slate-200
            px-5 py-4
            sm:px-6
          ">
            <div>
              <h2 className="text-base font-bold text-[#12111A] sm:text-lg">
                Your Posts
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Everything you've shared on ShareNest
              </p>
            </div>

            <div className="flex items-center rounded-xl bg-[#F6F7FB] p-1">
              <button
                onClick={() => setView("grid")}
                className={`
                  flex items-center justify-center
                  rounded-lg p-2
                  transition
                  ${
                    view === "grid"
                      ? "bg-white text-[#A855F7] shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }
                `}
                aria-label="Grid view"
              >
                <FiGrid size={17} />
              </button>

              <button
                onClick={() => setView("list")}
                className={`
                  flex items-center justify-center
                  rounded-lg p-2
                  transition
                  ${
                    view === "list"
                      ? "bg-white text-[#A855F7] shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }
                `}
                aria-label="List view"
              >
                <FiList size={17} />
              </button>
            </div>
          </div>

          {/* Loading */}
          {postsLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-[#A855F7]" />
            </div>
          )}

          {/* Empty state */}
          {!postsLoading && postList.length === 0 && (
            <div className="px-5 py-16 sm:px-6">
              <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                <div className="
                  flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  bg-purple-50
                  text-[#A855F7]
                ">
                  {view === "grid" ? <FiGrid size={26} /> : <FiList size={26} />}
                </div>

                <h3 className="mt-5 text-base font-bold text-[#12111A]">
                  No posts yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You haven't shared anything yet. Start your first post
                  and let your friends know what's happening.
                </p>
              </div>
            </div>
          )}

          {/* Grid view */}
          {!postsLoading && postList.length > 0 && view === "grid" && (
            <div className="grid grid-cols-3 gap-1 p-1 sm:gap-2 sm:p-2">
              {postList.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                >
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.caption || "Post"}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-slate-500">
                      {post.caption || post.content}
                    </div>
                  )}

                  <div className="
                    absolute inset-0 flex items-center justify-center gap-4
                    bg-black/0 text-transparent
                    transition
                    group-hover:bg-black/30 group-hover:text-white
                  ">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <FiHeart size={16} /> {post.likes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <FiMessageCircle size={16} /> {post.comments_count ?? 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* List view */}
          {!postsLoading && postList.length > 0 && view === "list" && (
            <div className="divide-y divide-slate-200">
              {postList.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.caption || "Post"}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm text-slate-700">
                      {post.caption || post.content}
                    </p>

                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiHeart size={14} className="text-[#A855F7]" />
                        {post.likes_count ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageCircle size={14} className="text-[#A855F7]" />
                        {post.comments_count ?? 0}
                      </span>
                      {post.created_at && (
                        <span>{formatJoinDate(post.created_at)}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MODALS
      ========================================================= */}

      {isEditOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {followModalType && (
        <FollowListPage
          type={followModalType}
          userId={profileUserId}
          onClose={() => setFollowModalType(null)}
        />
      )}

      {selectedPostId && (
        <PostDetails
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;